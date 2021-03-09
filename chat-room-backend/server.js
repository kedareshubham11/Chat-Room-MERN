// importing all the stuff
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Rooms from './dbRooms.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000;
let pipeline = [{ $match : { _id : '5ffc9ba568cc251744574d0b' } }];

const pusher = new Pusher({
    appId: "1134445",
    key: "c6e327ce193d85341260",
    secret: "fc7e236ca3fa8a57c06e",
    cluster: "ap2",
    useTLS: true
  });

// middlewares
app.use(express.json());

app.use(cors());
/*
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
}) */

// db config
const connection_url = ('mongodb+srv://admin:admin@cluster0.vpukj.mongodb.net/chat-room-db?retryWrites=true&w=majority');

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// ????
const db = mongoose.connection;

db.once('open', ()=>{
    console.log('DB Connected..');
    
    // const msgCollection = db.collection("messagecontents");
    // console.log(msgCollection);

    const roomCollection = db.collection("rooms");
    
    const changeStream = roomCollection.watch(pipeline);
    console.log('🚀🚀🚀');

    changeStream.on("change", (change) => {
    console.log('A change Occured 🔥🔥', change);

    if (change.operationType === 'insert') {
        const messageDetails = change.fullDocument;
        pusher.trigger('messages', 'inserted',
        {
            name: messageDetails.name,
            message: messageDetails.message,
            received: messageDetails.received,
            timestamp: messageDetails.timestamp,
        })
    }
    else {
        console.log("Error triggering Pusher");
    }


    });
    
});


// api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.get('/messages/sync', (req, res) => {
    const dbMessage = req.body;

    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data)
        }
    })
})

app.post('/rooms/create', (req, res) => {
    const dbRoom = req.body;
    Rooms.create(dbRoom, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data)
        }
    })
})

app.get('/rooms/sync', (req, res) => {
    const dbRoom = req.body;
    Rooms.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data)
        }
    })
})

app.put('/room/msgs/:id',(req, res) => {
    const data = req.body;
    const id = req.params.id;
    
    Rooms.findByIdAndUpdate(id,{$push: {messages: data}}, {new: true}, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data)
            pipeline = [{ $match : { _id : id } }];
            
        }
    })

 
})

// listener
app.listen(port, ()=> console.log(`Listening on localhost ${port}`));