import React, { useEffect, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import socket from '../socket';
export default function UserSlide(props, { dataOfLoginedUser, handleClickOnUser, data }) {

    const [currentUser, setCurrentUser] = useState({})

    const [currentUserWholeData, setCurrentUserWholeData] = useState({});

    const currentUserData = currentUserWholeData.friendList ? currentUserWholeData.friendList : [];


    const fetchUserInfo = async (id) => {
        try {
            const response = await fetch(`/api/user/${id}`);
            if (!response.ok) {
                return console.error(`Error while fetching user Data`);
            }

            const userInfo = await response.json();
            setCurrentUserWholeData(userInfo.user);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        try {
            if (dataOfLoginedUser) {
                setCurrentUser(dataOfLoginedUser._id || dataOfLoginedUser._id.$oid)
                fetchUserInfo(dataOfLoginedUser._id || dataOfLoginedUser._id.$oid);
            } else {
                console.log('Unavailable Props or currentUser already set');
            }
        } catch (error) {
            console.error(error);
        }
    }, [dataOfLoginedUser, props])


    const sendFriendRequest = async (id) => {
        try {
            const response = await fetch('http://localhost:5000/chat/friendrequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: currentUser._id, reciver: id, senderName: currentUserWholeData.name }),
            });
            console.log(await response.json());

            if (!response.ok) {
                const { error } = await response.json();
                toast.success('Unable to send friend request Try Again!')
                throw new Error(`Registration failed: ${error}`);
            }

            const responseData = await response.json();
            toast.success(responseData)

        } catch (error) {
            console.error('Error during sendign Friend Request:', error);
        }
    }

    return (
        <div id={props.id} className='userSlide' >
            <ToastContainer></ToastContainer>

            {
                props.avatar ?
                    <div className="avatarImage" dangerouslySetInnerHTML={{ __html: props.avatar }}></div> :
                    <img className='avatarImage' src="https://i.pinimg.com/236x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg" alt={`${props.name}'s_Image`} />
            }
            <div className='userDetails' onClick={() => {
                props.handleClickOnUser(props.data);
                socket.emit("join_room", props.data);
            }}>
                <h3>{props.name}</h3>
                {
                    props.msg ?
                        <h5>{props.msg}</h5> :
                        null
                }
            </div>
            {
                props.add && !currentUserData.includes(props.id) ?
                    <IconButton onClick={() => {
                        if(props.id){
                            sendFriendRequest(props.id);
                        }else{
                            console.log('id Hani');
                        }
                    }}>
                        <PersonAddIcon></PersonAddIcon>
                    </IconButton> : null
            }
        </div>
    )
}
