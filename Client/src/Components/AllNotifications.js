import { Bell } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react'
import NotificationTemplate from './MinorComponents/NotificationTemplate';
// import NotificationTemplate from './MinorComponents/NotificationTemplate';

export default function AllNotifications(props) {
    const currentUser = JSON.parse(localStorage.getItem('user'));


    const [showAbleNotification, setShowAbleNotification] = useState([]);
    const [notificationType, setNotificationType] = useState([]);
    const [notificationId, setNotificationId] = useState([]);


    const [showNotification, setShowNotification] = useState(true)

    const fetchNotification = async () => {
        const response = await fetch('/getNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: currentUser }),
        })

        const Notifcations = await response.json();

        if (Notifcations.length > 0) {
            console.log(Notifcations);
            Notifcations.map((noti) => {
                if (typeof (noti) === 'object') {
                    setShowAbleNotification(`${noti.from} sent you a friend request. Accept and start chatting!`);
                    setNotificationType(noti.frndReq);
                    setNotificationId(noti.id);
                } else if (typeof (noti) === 'string') {
                    setShowAbleNotification(`${noti}`);
                    setNotificationType(false);
                    setNotificationId('');
                }
            })
        }else{
            setShowNotification(false);
        }
    }

    useEffect(() => {
        fetchNotification();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='allUsers notification'>
            <h3 className='mainHeading'>
                <Bell />
                <span>{props.heading}</span>
            </h3>
            <NotificationTemplate showNotification={showNotification} notificationMessage={showAbleNotification} frndReq={notificationType} notificationId={notificationId} />
        </div>
    )
}
