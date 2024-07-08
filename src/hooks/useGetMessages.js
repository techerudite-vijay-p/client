import React, { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

function useGetMessages() {
    const [loading, setLoading] = useState(false);
    const { setMessages, messages, selectedConversation } = useConversation();

    useEffect(() => {
        getMessages(selectedConversation._id);
        setLoading(false);
    }, [selectedConversation._id, setMessages])

    const getMessages = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(`/messages/${selectedConversation?._id}`)
            const data = await res.json();
            if (data?.error) {
                throw new Error(data.error);
            }
            setMessages(data);
        } catch (error) {
            toast.error(error.messages);
        } finally {
            setLoading(false);
        }
    }

    return { messages, loading }
}

export default useGetMessages
