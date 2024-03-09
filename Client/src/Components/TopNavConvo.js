import React from 'react';
import IconButton from '@mui/material/IconButton';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

export default function TopNavConvo(props) {
    return (
        <div className='convoTopNav'>
            <div className='convoUserDetails'>
                {
                    props.data.avatar ?
                        <div className="avatarImage" dangerouslySetInnerHTML={{ __html: props.data.avatar }}></div> :
                        <img className='avatarImage' src="https://i.pinimg.com/236x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg" alt={`${props.name}'s_Image`} />
                }                    <h3>{props.data.name || 'User'}</h3>
            </div>
            <div className='convoChatOptions'>
                <IconButton>
                    <VideocamOutlinedIcon />
                </IconButton>
                <IconButton>
                    <CallOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SearchOutlinedIcon />
                </IconButton>
                <span className='dropDown'></span>
                <IconButton>
                    <ArrowDropDownOutlinedIcon />
                </IconButton>
            </div>
        </div>
    )
}
