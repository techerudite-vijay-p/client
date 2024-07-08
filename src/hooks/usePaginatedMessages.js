import { useState, useEffect } from 'react';
import axios from 'axios';

const usePaginatedMessages = (userToChatId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchMessages = async (page) => {
        setLoading(true);
        try {
            const limit = 20;  // Number of messages to fetch per request
            const offset = page * limit;
            const response = await axios.get(`/api/messages/${userToChatId}`, {
                params: { limit, offset }
            });
            const newMessages = response.data;
            setMessages(prevMessages => [...newMessages, ...prevMessages]);
            setHasMore(newMessages.length === limit);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages(page);
    }, [page]);

    return { messages, loading, hasMore, setPage };
};

export default usePaginatedMessages;
