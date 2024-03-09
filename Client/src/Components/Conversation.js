import React, { useEffect, useState } from 'react';
import '../css/Conversation.css';
import InputFeild from './InputFeild';
import ConvoDiv from './ConvoDiv';
import TopNavConvo from './TopNavConvo';
import socket from '../socket';


export default function Conversation(props) {

    const [roomId, setRoomId] = useState('');
    const [userData, setUserData] = useState(props.data)

    useEffect(() => {
        if (props.dataOfLoginedUser._id && props.data._id) {
            const newRoomId = props.dataOfLoginedUser._id.concat("", (props.data._id).split("").sort().join(""));
            setRoomId(newRoomId);
            setUserData(props.data);
        } 
    }, [props.dataOfLoginedUser, props.data]);

    useEffect(() => {
        socket.on("join_room", (data) => {
            console.log(`Room is joined:`, data);
        });
        return () => {
            socket.off("join_room");
        };
    }, []); 


    return (
        <>
            {
                props.data.name ?
                    <div className='convoComponent'>
                        <TopNavConvo data={userData} roomId={roomId} dataOfLoginedUser={props.dataOfLoginedUser}></TopNavConvo>
                        <ConvoDiv data={userData} roomId={roomId} dataOfLoginedUser={props.dataOfLoginedUser}></ConvoDiv>
                        <InputFeild data={userData} roomId={roomId} dataOfLoginedUser={props.dataOfLoginedUser}></InputFeild>
                    </div> :

                    <div className="CommonComponent">
                        <div className="welcome-container">
                            <h1 className="app-name">Welcome {props.dataOfLoginedUser.name} to Wisper Talks!</h1>
                            <p className="tagline">Where Conversations Come to Life!</p>
                            <div className="features">
                                <p>Explore the features:</p>
                                <ul>
                                    <li>📱 Instant Messaging</li>
                                    <li>📸 Photo and Media Sharing</li>
                                    <li>🎉 Group Chats</li>
                                    <li>🔒 Enhanced Security</li>
                                </ul>
                            </div>
                            <p className="call-to-action">Ready to embark on a journey of endless conversations? Sign up now and let the chatting begin!</p>
                        </div>
                    </div>
            }
        </>
    )
}
