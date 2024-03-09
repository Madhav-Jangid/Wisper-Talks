/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import SideBar from '../Components/SideBar';
import AllUsersNav from '../Components/AllUsersNav';
import { Navigate } from 'react-router-dom';

export default function Notifications({ isPrivate, changeIsPrivate }) {
    const [dataState, setDataState] = useState({});
    const [data, setData] = useState({});

    const handleClickOnUser = (data) => {
        try {
            setDataState(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setData(dataState)
    }, [dataState])
    return (
        <div className='MainScreen' style={{ display: 'flex' }}>
            {
                isPrivate ?
                    null :
                    <Navigate to={'/'} />
            }
            <div className="sidebarsBoth">
                <SideBar changeIsPrivate={changeIsPrivate} active={'notifiactions'} data={'avatar'} />
                <AllUsersNav handleClickOnUser={handleClickOnUser} heading={'Notifications'}></AllUsersNav>
            </div>
        </div>
    )
}
