import React, { useEffect, useRef, useState } from "react";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/socketContext";
import { useAuthContext } from "../../context/AuthContext";

const Conversation = ({ conversation, emoji, lastIndex }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isSelected = selectedConversation?._id === conversation?._id;
	const { authUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation?._id);
	const me = conversation?._id === authUser?._id
	const [openProfileModel, setOpenProfileModel] = useState(false);
	const [showProfileDropdown,setShoProfileDropdown] = useState(false);

	const dropDownRef = useRef(null);

	const handleClickOutside = (event) => {
		if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
			setShoProfileDropdown(false);
		}
	}
	const handleProfileClick = () => {
		setOpenProfileModel(true);
	}

	useEffect(() => {
		document.addEventListener("mousedown" , handleClickOutside);
		return () => {
            document.addEventListener("mousedown", handleClickOutside);
        };
	},[showProfileDropdown]);

	return (
		<>
			<div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
				onClick={() => setSelectedConversation(conversation)}
			>

				<div className={`avatar ${isOnline ? "online" : ""} `}>
					<div className='w-12 rounded-full menu' onClick={handleProfileClick}>
						<img
							src={conversation?.profilePic || "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"}
							alt='user avatar'
						/>
					</div>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-gray-200'>{conversation?.fullName} {me && <span className="font-bold text-gray-200" >(me)</span>}</p>
						<span className='text-xl'>🎃</span>
					</div>
				</div>
			</div>

			{!lastIndex && <div className='divider my-0 py-0 h-1' />}


			{/* {
				openProfileModel &&
				<div ref={dropDownRef}>
					<ul tabIndex={0} className="menu bg-base-200 w-56 rounded-box">
						<li>
							<a>
								<div className='w-12 rounded-full' onClick={handleProfileClick}>
									<img
										src={conversation?.profilePic || "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"}
										alt='user avatar'
									/>
								</div>
							</a>
						</li>
						<li>
							<a>
								<div className='flex flex-col flex-1'>
									<div className='flex gap-3 justify-between'>
										<p className='font-bold text-gray-200'>{conversation?.fullName} {me && <span className="font-bold text-gray-200" >(me)</span>}</p>
									</div>
								</div>
							</a>
						</li>
					</ul>
				</div>
			} */}

			{/* {
				openProfileModel && <div className="bg-dark" style={{ width: "200px", background: "black" }}>
					<div className='w-12 rounded-full' onClick={handleProfileClick}>
						<img
							src={conversation?.profilePic || "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"}
							alt='user avatar'
						/>
					</div>
					<div className='flex flex-col flex-1'>
						<div className='flex gap-3 justify-between'>
							<p className='font-bold text-gray-200'>{conversation?.fullName} {me && <span className="font-bold text-gray-200" >(me)</span>}</p>
						</div>
					</div>
				</div>
			} */}
		</>
	);
};
export default Conversation;