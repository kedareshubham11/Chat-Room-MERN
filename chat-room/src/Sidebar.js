import React, { useEffect, useState } from 'react';
import "./Sidebar.css";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import axios from './axios';
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';


function Sidebar() {    
    const [{}, dispatch] = useStateValue();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get('/rooms/sync')
    .then(response => {
      setRooms(response.data);
    })
    }, [rooms])

    const logOut = () =>{
        dispatch({
            type: actionTypes.SET_USER,
            user: null,
        });
    }

    return (
        <div className="sidebar">
            
            <div className="sidebar__header">
                <IconButton>
                <Avatar src="https://pbs.twimg.com/profile_images/1057850240236105728/hp3IKSk8_400x400.jpg" />
                </IconButton>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>

                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton onClick={logOut}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new Chat" type="text" />
                    
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat/>
                {rooms.map((rooms) => (
                <SidebarChat key={rooms.id} id={rooms._id} roomName={rooms.room}/>
                ))}
            </div>
        </div>
    )
}

export default Sidebar;
