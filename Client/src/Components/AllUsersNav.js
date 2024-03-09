/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import "../css/Allusers.css";
import UserSlide from '../Components/UserSlide';
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from '@mui/material';
import { ChatTeardropDots } from '@phosphor-icons/react';

export default function AllUsersNav(props) {
    const [users, setUsers] = useState([]);

    const loadUserFromDatabase = async () => {
        try {
            const response = await fetch('/api/users');

            if (!response.ok) {
                throw new Error('Error fetching users from the database');
            }

            const dataOfAllUsers = await response.json();
            const filteredFriends = dataOfAllUsers.filter(user => user.friendList.includes(props.dataOfLoginedUser._id) && props.dataOfLoginedUser.friendList.includes(user._id || user._id.$oid));
            const sortedUsers = filteredFriends.sort((a, b) => a.name.localeCompare(b.name));
            setUsers(sortedUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const [name, setName] = useState('');
    const [searchedUser, setSearchedUser] = useState(false);
    const [searchResult, setSearchResult] = useState([]);


    const SearchUsers = async () => {
        try {
            const response = await fetch('/chat/searchUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            })

            if (!response.ok) {
                console.log('Error while searching User');
                return
            }

            const data = await response.json();
            setSearchResult(data)
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        loadUserFromDatabase();
    }, [props.dataOfLoginedUser]);

    return (
        <div className='allUsers' onClick={() => {
            props.loadinBar();
        }}>
            <h3 className='mainHeading'>
                <ChatTeardropDots />
                <span>{props.heading}</span>
            </h3>
            <div className="searchUserInputFeild">
                <input
                    type='text'
                    placeholder='Search or start a new chat'
                    value={name}
                    onChange={(e) => {
                        setSearchedUser(true);
                        setName(e.target.value);
                        SearchUsers();
                    }}
                ></input>

                {
                    searchedUser ?
                        <IconButton className='crossIcon'
                            onClick={() => {
                                setName('')
                                setSearchedUser(false)
                            }}>
                            <CancelIcon ></CancelIcon>
                        </IconButton> : null
                }
            </div>

            {
                !searchedUser ?
                    (users.length !== 0 ?
                        users.map((user) => (
                            <UserSlide dataOfLoginedUser={props.dataOfLoginedUser} handleClickOnUser={props.handleClickOnUser} key={user._id} id={user._id} avatar={user.avatar} name={user.name} data={user} />
                        ))
                        :
                        <div className='noMessages'>
                            <span>You can add friends by searching them and sending them friend request.</span>
                        </div>) : (searchResult.map((user) => (
                            <UserSlide dataOfLoginedUser={props.dataOfLoginedUser} handleClickOnUser={props.handleClickOnUser} key={user._id} id={user._id} avatar={user.avatar} name={user.name} data={user} add={true} />
                        )))
            }


        </div>
    )
}
