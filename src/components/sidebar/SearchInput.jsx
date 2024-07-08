import React, { useState } from "react";
import toast from "react-hot-toast";

// STARTER CODE SNIPPET
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { conversations } = useGetConversations();
	const { setSelectedConversation } = useConversation()
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;

		const conversation = conversations?.find(c => c.fullName.toLowerCase().includes(search.toLowerCase()));
		if (conversation) {
			setSelectedConversation(conversation)
			setSearch("");
		}else{
			toast.error("No such user found")
		}
	};
	return (
		<form className='flex items-center gap-2' onSubmit={handleSubmit}>
			<input onChange={(e) => setSearch(e.target.value)} type='text' placeholder='Search…' className='input input-bordered rounded-full' />
			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>
		</form>
	);
};
export default SearchInput;