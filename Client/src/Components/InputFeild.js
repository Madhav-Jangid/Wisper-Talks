import React, { useEffect, useState } from 'react';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { PaperPlaneTilt, Paperclip } from '@phosphor-icons/react';
import EmojiPicker from 'emoji-picker-react';
import { IconButton } from '@mui/material';
import io from 'socket.io-client';


export default function InputFeild(props) {
    const socket = io('http://localhost:6969');

    const [currentUserData,setCurrentUserData] = useState('')

    const roomId = currentUserData.concat(props.data._id).split("").sort().join("");

    const [message, setMessage] = useState('');

    const [showEmoji, setShowEmoji] = useState(false);

    const handelEmojiclickFunction = () => {
        setShowEmoji(showEmoji => !showEmoji);
    }

    const handleEmojiClick = (emojiData) => {
        const emojiValue = emojiData.emoji;
        setMessage((prevMessage) => prevMessage + emojiValue);
    };

    const SendMessageToUser = async () => {
        try {
            setMessage('');
            console.log(props.data);
            const response = await fetch('http://localhost:5000/chats/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: roomId,
                    currentUser: currentUserData,
                    message: message,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const userData = await response.json();

            const data = {
                room: roomId,
                message: message
            };
            socket.emit('send_message', data);
            socket.disconnect();
            
            console.log('Message sent:', userData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    useEffect(() => {
        try {
            if (props.data && props.roomId && props.dataOfLoginedUser) {
                setCurrentUserData(props.dataOfLoginedUser._id);
            } else {
                console.log('Unavailable Props or currentUser already set');
            }
        } catch (error) {
            console.error(error);
        }
    }, [props.data, props.roomId, props.dataOfLoginedUser, currentUserData]);

    return (
        <div className='convoInputs'>
            {showEmoji && (
                <EmojiPicker
                    style={{
                        position: 'absolute',
                        height: '330px',
                        bottom: 70,
                        left: 5,
                        resize: 'horizontal',
                        overflow: 'auto',
                        borderRadius: '20px',
                        borderBottomLeftRadius: '0',
                        backgroundColor: 'var(--primary-blue4)',
                    }}
                    onEmojiClick={handleEmojiClick}
                />
            )}

            <IconButton onClick={handelEmojiclickFunction}>
                <TagFacesIcon />
            </IconButton>

            <IconButton onClick={() => {
                // Handle Paperclip button click
            }}>
                <Paperclip color='var(--primary-text-light)' size={28} />
            </IconButton>

            <input
                type="text"
                placeholder={`Type a message for ${props.data.name}`}
                name='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <IconButton onClick={SendMessageToUser}>
                <PaperPlaneTilt style={{ color: 'var(--primary-text-light)' }} size={28} />
            </IconButton>
        </div>

    )
}
