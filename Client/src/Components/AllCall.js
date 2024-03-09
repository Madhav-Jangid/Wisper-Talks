import { Phone } from '@phosphor-icons/react';
import React from 'react'

export default function AllCall(props) {
    return (
        <div className='allUsers' onClick={() => {
            props.loadinBar();
        }}>
            <h3 className='mainHeading'>
                <Phone />
                <span>{props.heading}</span>
            </h3>


        </div>
    )
}
