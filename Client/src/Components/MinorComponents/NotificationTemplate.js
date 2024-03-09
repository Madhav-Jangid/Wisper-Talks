import { IconButton } from '@mui/material';
import "./NotificationTemplate.css"
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
export default function NotificationTemplate({ frndReq, frndReqSender, showNotification, notificationMessage, notificationId }) {

    const currentUser = JSON.parse(localStorage.getItem('user'));


    const confirmFriendRequest = async () => {
        const response = await fetch('/confirmNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                friendToAdd: notificationId, userId: currentUser
            }),
        })

        console.log(response);
    }

    const cancelFriendRequest = async () => {
        const response = await fetch('/cancelNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToRemove: notificationId, userId: currentUser
            }),
        })
        console.log(response);
        console.log(showNotification);
    }
    return (
        <div className="NotificationTemplate">
            {showNotification ?
                (
                    frndReq ?
                        <>
                            <h3>{notificationMessage}</h3>
                            <div className="confirmationLogo">
                                <IconButton onClick={confirmFriendRequest}>
                                    <CheckCircleIcon className='confirmIcon' />
                                </IconButton>
                                <IconButton onClick={cancelFriendRequest}>
                                    <CancelIcon className='cancelIcon' />
                                </IconButton>
                            </div>
                        </> :
                        <>
                            <h3>{notificationMessage}</h3>
                        </>
                ) : <h3>No Notification till now </h3>
            }

        </div>
    )
}
