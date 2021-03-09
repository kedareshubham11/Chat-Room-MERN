import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import "./SidebarChat.css";
import axios from './axios';
import { Link } from 'react-router-dom';

function SidebarChat({ addNewChat, roomName, id }) {
    const [seed, setSeed] = useState('askdlasdhajh');


    useEffect(() => {
        setSeed(id);
    }, [])

    const createChat = async() => {
        const roomName = prompt("Please enter name for chat");

        if(roomName) { 
            await axios.post("/rooms/create", {
                room: roomName
            });
        }
            // do some clever database stuff here...
        
        }
    

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/4.5/api/male/${seed}.svg`} />
            <div className="sidebarChat__info">
                <h2>{roomName}</h2>
                <p> last msg on room</p>
            </div>
        </div>
        </Link>
    ): (
        <div onClick={createChat}
        className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
