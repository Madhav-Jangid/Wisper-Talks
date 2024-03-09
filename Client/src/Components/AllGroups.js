import { Users } from '@phosphor-icons/react';
import React from 'react'

export default function AllGroups(props) {
    return (
        <div className='allUsers' onClick={() => {
            props.loadinBar();
        }}>
            <h3 className='mainHeading'>
                <Users />
                <span>{props.heading}</span>
            </h3>

            {/* <NotificationTemplate frndReqSender={'madhav'} notificationMessage={'haa v lodu ki dekh da peya '} /> */}

        </div>
    )
}
