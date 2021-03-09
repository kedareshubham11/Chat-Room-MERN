import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import "./Chat.css";
import axios from './axios';
import Pusher from 'pusher-js';
import { useParams } from 'react-router-dom';

function Chat({ message }) {
    const messageEl = useRef(null);
    const [input, setInput] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [msgs, setMsgs] = useState([]);
     
    useEffect(() => {
        if (messageEl) {
          messageEl.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])
      
      useEffect(() => {
        const pusher = new Pusher('c6e327ce193d85341260', {
          cluster: 'ap2'
        });
    
        const channel = pusher.subscribe('messages');
        channel.bind('inserted', (newMessage) => {
          // alert(JSON.stringify(newMessage));
          setMsgs([...msgs, newMessage]);
          console.log('PUSHERRR PUSHER 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
        });
        
        return () => {
          channel.unbind_all();
          channel.unsubscribe();  
        };
      }, [msgs]);

    useEffect(() => {
        if (roomId) {
            axios.get('/rooms/sync')
            .then(response => {
            setRoomName(response.data.find( record => record._id === roomId ).room);
            setMsgs(response.data.find( record => record._id === roomId ).messages);
            

    })
        }
        console.log(msgs);
    }, [roomId])

    const sendMessage = async (e) => {
        e.preventDefault();

        await axios.put(`/room/msgs/${roomId}`, {
            message: input,
            name: "shubham",
            timestamp: "just now.",
            received: true
        });

        setInput('');
    }
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/4.5/api/male/${roomId}.svg`} />

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at..</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton> 
                        <SearchOutlined />   
                    </IconButton>

                    <IconButton> 
                        <AttachFile />   
                    </IconButton>

                    <IconButton> 
                        <MoreVert />   
                    </IconButton>   
                </div>
            </div>

            <div className="chat__body" ref={messageEl}>
                
                {msgs.map((msgs) => (
                <p className={`chat__message ${msgs.received && "chat__receiver"}`}>
                <span className="chat__name">{msgs.name}</span>
                {msgs.message}

                <span className="chat__timestamp">
                    {msgs.timestamp}
                </span>
            </p>
                ))}
                
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Type a message" 
                    type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat;
