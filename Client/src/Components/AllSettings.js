import { Gear } from '@phosphor-icons/react';
import React from 'react'

export default function AllSettings(props) {
    return (
        <div className='allUsers' onClick={() => {
            props.loadinBar();
        }}>
            <h3 className='mainHeading'>
                <Gear />
                <span>{props.heading}</span>
            </h3>


        </div>
    )
}
