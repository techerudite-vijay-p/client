import React, { useEffect, useRef, useState } from "react";
import { BsSend, BsPaperclip, BsEmojiSmile } from "react-icons/bs";
import useConversation from "../../zustand/useConversation";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    const emojiPickerRef = useRef(null);

    const { setSelectedConversation, setMessages } = useConversation();
    const { sendMessage, loading } = useSendMessage();

    const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message && !attachment) return;
        await sendMessage({ message, attachment });
        setMessage("");
        setAttachment(null);
        setAttachmentPreview(null);
    };

    const handleFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            setAttachment(file);
            setAttachmentPreview(URL.createObjectURL(file));
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
    };

    const handleAskAI = async () => {
        if (!message) return;
        setLoadingAI(true);
        try {
            const response = await fetch("/messages/get-ai-response", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            })
            // const response = await axios.post('/messages/get-ai-response', { message });
            console.log("response-->>>>>>>>>", response)
            setMessage(response.data.aiMessage);
        } catch (error) {
            console.error("Error fetching AI response::::::::::", error);
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
            <div className='w-full relative'>
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
                    placeholder='Send a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <input type='file' className='hidden' id='file-input' onChange={handleFileChange} />
                <label htmlFor='file-input' className='absolute inset-y-0 end-0 flex items-center pe-12 cursor-pointer'>
                    <BsPaperclip />
                </label>
                <div className='absolute inset-y-0 end-0 flex items-center pe-8 cursor-pointer' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <BsEmojiSmile />
                </div>
                <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
                    {loading ? <span className='loading loading-spinner mx-auto'></span> : <BsSend />}
                </button>
            </div>
            {attachment && <div className='text-white mt-2'>{attachment?.name}</div>}
            {showEmojiPicker && (
                <div ref={emojiPickerRef} className='absolute bottom-12 right-4'>
                    <EmojiPicker onEmojiClick={(event, emojiObject) => handleEmojiClick(event, emojiObject)} />
                </div>
            )}
            <button
                type='button'
                className='mt-2 p-2 bg-blue-500 text-white rounded'
                onClick={handleAskAI}
                disabled={loadingAI}
            >
                {loadingAI ? 'Generating...' : 'Ask AI'}
            </button>
        </form>
    );
};

export default MessageInput;
