/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { animateScroll, Element } from 'react-scroll';
import { io } from 'socket.io-client';
export default function ConvoDiv(props) {
    const socket = io('http://localhost:6969');

    const [currentUser, setCurrentUser] = useState(false)
 
    useEffect(() => {
        const messageListener = (data) => {
            console.log(data);
            alert(data.message);
        };
    
        socket.on('receive_message', messageListener);
    
        return () => {
            socket.off('receive_message', messageListener);
        };
    }, []);

    const showMessages = (messageList) => {
        const conversationDiv = document.querySelector('.conversation');
        conversationDiv.innerHTML = '';
        if (messageList) {
            for (let message = 0; message < messageList.length; message++) {
                let messageObj = messageList[message];
                let from = messageObj.from;
                let date = messageObj.date;
                let textMessage = messageObj.message; 
                createMessageDiv(from, textMessage, extractTimeFromDate(date));
            }
        } else {
            console.log('No messages to display');
        }
    };

    const extractTimeFromDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const newDate = extractDateFromDate(dateString); 
        return `| ${newDate} | ${formattedHours}:${minutes} ${amOrPm}`;
    };


    const extractDateFromDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so we add 1
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };


    const options = {
        duration: 300,
        smooth: true,
    };

    function createMessageDiv(from, textMessage, date,dateStamp) {
        try {
            const mainMessageCont = document.createElement('div');
            if (from === currentUser._id) {
                mainMessageCont.classList.add('messageFromCurrentUser');
            } else {
                mainMessageCont.classList.add('messageFromSecondUser');
            }

            const avatarContainer = document.createElement('div');
            avatarContainer.classList.add('avatarContainer');

            const avatarImage = document.createElement('div');
            avatarImage.classList.add('avatarImage');


            if (from === currentUser._id && currentUser.avatar) {
                avatarImage.innerHTML = currentUser.avatar;
                avatarContainer.appendChild(avatarImage);
                mainMessageCont.appendChild(avatarContainer);
            } else {
                const defaultAvatar = document.createElement('img');
                defaultAvatar.classList.add('avatarImage');
                defaultAvatar.src = "https://i.pinimg.com/236x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg";
                defaultAvatar.alt = `${currentUser.name}'s_Image`;
                avatarContainer.appendChild(defaultAvatar);
                mainMessageCont.appendChild(avatarContainer);
            }

            const textMessageCont = document.createElement('div');
            textMessageCont.classList.add('textMessageCont');

            const userName = document.createElement('h6');
            if (from === currentUser._id) {
                userName.innerHTML = currentUser.name;
            } else {
                userName.innerHTML = props.data.name;
            }

            const messageText = document.createElement('h4');
            messageText.innerHTML = textMessage;

            const messageDate = document.createElement('span');
            messageDate.innerHTML = date;

            textMessageCont.appendChild(userName);
            textMessageCont.appendChild(messageText);
            textMessageCont.appendChild(messageDate);

            mainMessageCont.appendChild(textMessageCont);

            const hero = document.querySelector('.conversation');
            hero.appendChild(mainMessageCont);
            animateScroll.scrollToBottom({ containerId: 'conversation' }, options);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/chat/getmessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: (props.roomId).split('').sort().join('') }),
            });
            if (!response.ok) {
                console.log('Error:', response.status, response.statusText);
                return;
            } else {
                const messagesData = await response.json();
                if (messagesData) {
                    showMessages(messagesData.conversation);
                } else {
                    const conversationDiv = document.querySelector('.conversation');
                    conversationDiv.innerHTML = `<div id="deaultConvo">No conversation with ${props.data.name}</div>`;
                }
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    useEffect(() => {
        try {
            if (props.data && props.roomId && props.dataOfLoginedUser) {
                setCurrentUser(props.dataOfLoginedUser);
                fetchMessages();
            } else {
                console.log('Unavailable Props or currentUser already set');
            }
        } catch (error) {
            console.error(error);
        }
    }, [props.data, props.roomId, props.dataOfLoginedUser, currentUser]);


    return <Element id="conversation" name="conversation" className="conversation"></Element>
}
