// import React from 'react'
import useConversation from '../zustand/useConversation'
import { useEffect } from 'react';
import { useSocketContext } from '../context/socketContext';
import notificationSound from "../assets/sounds/notification.mp3";

function useListenMessages() {
    const { messages, setMessages ,setSelectedConversation} = useConversation();
    const { socket } = useSocketContext();
                
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            newMessage.shoudShake = true;
            const sound = new Audio()
            sound.play(notificationSound);
            if (newMessage?.senderId === setSelectedConversation?._id) {
                setMessages([...messages, newMessage])
            }
        })

        return () => {
            socket?.off('newMessage');
        }
    }, [socket, messages, setMessages]);
}

export default useListenMessages
