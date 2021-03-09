import { useEffect, useState } from 'react';
import './App.css';
import Login from "./Login";
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }, dispatch] = useStateValue();

const [message, setMessage] = useState([]);


  useEffect(() => {
    axios.get('/messages/sync')
    .then(response => {
      setMessage(response.data);
    })
  }, [])

  useEffect(() => {
    const pusher = new Pusher('c6e327ce193d85341260', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessage([...message, newMessage]);
    });
    
    return () => {
      channel.unbind_all();
      channel.unsubscribe();  
    };
  }, [message]);

  console.log(message);


  return (
    <div className="app">
    {!user ? (
      <Login />
    ) : (

      <div className="app__body">
      
    <Router>
    <Sidebar />
      <Switch>
      <Route path="/rooms/:roomId">
      <Chat 
      message={message}
      />
      </Route>
      
      

      </Switch>
    </Router>
    </div>
    )}
  </div>
    
  );
}

export default App;
