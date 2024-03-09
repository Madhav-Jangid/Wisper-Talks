import React, { useState } from 'react';
import '../css/SideBar.css';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Bell, CaretLeft, CaretRight, ChatTeardropDots, Gear, Phone, Users } from '@phosphor-icons/react';
import Switch from '@mui/material/Switch';
import { Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function SideBar({ active, changeIsPrivate, setActiveLink, data }) {

    const [width, setWidth] = useState(80);
    const [isNavOpened, setIsNavOpened] = useState(true)

    const ShowLeftnav = () => {
        if (isNavOpened) {
            setWidth(250)
        } else {
            setWidth(80)
        }
        setIsNavOpened(!isNavOpened)
    }

    const highlightLink = (val) => {
        const highlighter = document.querySelector('.highlighter');
        if (highlighter) {
            const topValue = (52 * val) + 93 + val;
            highlighter.style.top = `${topValue}px`;
        }
    }

    const [theme, setTheme] = useState(false);

    const toggleTheme = () => {
        if (theme) {
            document.body.classList.remove('dark')
        } else {
            document.body.classList.add('dark')
        }
    }


    const label = { inputProps: { 'aria-label': 'Color switch demo' } };
    const [throwUser, setThrowUser] = useState(false)

    const logoutUser = () => {
        Swal.fire({
            title: "Confirmation",
            text: "Are you sure you want to log out? You will need to enter your email and password for the next login.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log me out!"
        }).then((result) => {
            if (result.isConfirmed) {
                setThrowUser(true);
                Swal.fire({
                    title: "Logged Out",
                    text: "You have been successfully logged out.",
                    icon: "success"
                });
            }
        });

    }

    return (
        <div className="SideNavBar" style={{ width: width }}>
            {throwUser ?
                <>
                    {localStorage.clear()}
                    <Navigate to={'/'}></Navigate>
                </>
                : null
            }
            <nav className="sideNavIcons">
                <ul className='topIcon'>
                    <div className="highlighter" style={isNavOpened ? { opacity: 1 } : { opacity: 0 }}></div>
                    {
                        !isNavOpened ?
                            <li className={`profileDivImage ${active === 'profile' ? 'activeNavLink' : 'nonActiveNavLink'}`}>
                                <Link className='newNavLink' style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }} to={'/profile'}>
                                    {
                                        data.avatar ?
                                            <div className="avatarImage" dangerouslySetInnerHTML={{ __html: data.avatar }}></div> :
                                            <img className='avatarImage' src="https://i.pinimg.com/236x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg" alt={`${data.name}'s_Image`} />
                                    }
                                    <span style={{ marginLeft: 10, fontWeight: 600 }}>{data.name}</span>
                                </Link>
                            </li> :
                            <Link className='newNavLink' to={'/profile'}>
                                {data ?
                                    (data.avatar ?
                                        <div className="avatarImage" dangerouslySetInnerHTML={{ __html: data.avatar }}></div> :
                                        <img className='avatarImage' src="https://i.pinimg.com/236x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg" alt={`${data.name}'s_Image`} />) : null
                                }
                            </Link>
                    }

                    {
                        !isNavOpened ?
                            <li className={active === 'msg' ? 'activeNavLink' : 'nonActiveNavLink'}>
                                <Link className='newNavLink' to={'/home/chats'}>
                                    <IconButton>
                                        <ChatTeardropDots className='phosphor-icon' />
                                    </IconButton>
                                    <span>Chats</span>
                                </Link>
                            </li> :
                            <Link className='newNavLink' to={'/home/chats'}>
                                <IconButton onClick={() => {
                                    highlightLink(0);
                                    setActiveLink('msg');
                                }}>
                                    <ChatTeardropDots className='phosphor-icon i1' />
                                </IconButton>
                            </Link>

                    }
                    {
                        !isNavOpened ?
                            <li className={active === 'groups' ? 'activeNavLink' : 'nonActiveNavLink'}>
                                <Link className='newNavLink' to={'/home/groups'}>
                                    <IconButton>
                                        <Users className='phosphor-icon' />
                                    </IconButton>
                                    <span>Groups</span>
                                </Link>
                            </li> :
                            <Link className='newNavLink' to={'/home/groups'}>
                                <IconButton onClick={() => {
                                    highlightLink(1);
                                    setActiveLink('groups');
                                }}>
                                    <Users className='phosphor-icon i2' />
                                </IconButton>
                            </Link>

                    }
                    {
                        !isNavOpened ?
                            <li className={active === 'calls' ? 'activeNavLink' : 'nonActiveNavLink'}>
                                <Link className='newNavLink' to={'/home/calls'}>
                                    <IconButton>
                                        <Phone className='phosphor-icon' />
                                    </IconButton>
                                    <span>Calls</span>
                                </Link>
                            </li> :
                            <Link className='newNavLink' to={'/home/calls'}>
                                <IconButton onClick={() => {
                                    highlightLink(2);
                                    setActiveLink('calls');
                                }}>
                                    <Phone className='phosphor-icon i3' />
                                </IconButton>
                            </Link>

                    }
                    {
                        !isNavOpened ?
                            <li className={active === 'notifiactions' ? 'activeNavLink' : 'nonActiveNavLink'}>
                                <Link className='newNavLink' to={'/home/notifications'}>
                                    <IconButton>
                                        <Bell className='phosphor-icon' />
                                    </IconButton>
                                    <span>Notifiactions</span>
                                </Link>
                            </li> :
                            <Link className='newNavLink' to={'/home/notifications'}>
                                <IconButton onClick={() => {
                                    highlightLink(3);
                                    setActiveLink('notifiactions');
                                }}>
                                    <Bell className='phosphor-icon i4' />
                                </IconButton>
                            </Link>

                    }
                    {
                        !isNavOpened ?
                            <li className={active === 'settings' ? 'activeNavLink' : 'nonActiveNavLink'}>
                                <Link className='newNavLink' to={'/home/settings'}>
                                    <IconButton>
                                        <Gear className='phosphor-icon' />
                                    </IconButton>
                                    <span>Settings</span>
                                </Link>
                            </li> :
                            <Link className='newNavLink' to={'/home/settings'}>
                                <IconButton onClick={() => {
                                    highlightLink(4);
                                    setActiveLink('settings');
                                }}>
                                    <Gear className='phosphor-icon i5' />
                                </IconButton>
                            </Link>

                    }
                </ul>

                <ul className='bottomIcons'>
                    <li style={isNavOpened ? {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    } : {
                        display: 'block'
                    }} >
                        <Switch {...label} onClick={() => {
                            setTheme(!theme);
                            toggleTheme();
                        }} color="primary" />
                        {
                            !isNavOpened ?
                                <span>{theme ? 'Dark Theme' : 'Light Theme'}</span> :
                                null
                        }
                    </li>
                    {
                        !isNavOpened ?
                            <li className={active === 'logout' ? 'activeNavLink' : 'nonActiveNavLink'} onClick={async () => {
                                logoutUser();
                                changeIsPrivate();
                            }
                            } >
                                <IconButton>
                                    <LogoutIcon></LogoutIcon>
                                </IconButton>
                                <span>Logout</span>
                            </li> :
                            <IconButton onClick={async () => {
                                changeIsPrivate();
                                logoutUser();
                            }
                            }>
                                <LogoutIcon></LogoutIcon>
                            </IconButton>

                    }

                </ul>
            </nav>
            <IconButton onClick={() => ShowLeftnav()} className='CaretRightButton'>
                {
                    isNavOpened ?
                        <CaretRight className='CaretRight' /> :
                        <CaretLeft className='CaretRight' />
                }
            </IconButton>
        </div>
    );
}
