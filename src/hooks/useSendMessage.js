import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";
const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async ({ message, attachment, receiverId }) => {
		setLoading(true);
		try {
			let formData = new FormData();
			if (message) formData.append("message", message);
			if (attachment) formData.append("attachment", attachment);
			const receiver = receiverId || selectedConversation._id;

			const res = await fetch(`/messages/send/${receiver}`, {
				method: "POST",
				body: formData
			});

			// const res = await axios.post(`/messages/send/${receiver}`, formData);

			const data = await res.json();

			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;