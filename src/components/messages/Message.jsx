import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const [showImageModal, setShowImageModal] = useState(false);
	const [showPdfModal, setShowPdfModal] = useState(false);

	const shakeClass = message.shouldShake ? "shake" : "";
	console.log("message------------",message)
	const openImageModal = () => {
		setShowImageModal(true);
	};

	const closeImageModal = () => {
		setShowImageModal(false);
	};

	const openPdfModal = () => {
		setShowPdfModal(true);
	};

	const closePdfModal = () => {
		setShowPdfModal(false);
	};

	const isPdf = message.fileUrl?.endsWith('.pdf');
	const defaultLayoutPluginInstance = defaultLayoutPlugin();

	return (
		<div className={`chat ${chatClassName}`} >
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			{message?.message && <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message?.message}</div>}

			{message?.fileUrl && !isPdf && (
				<div className='mt-2' style={{ width: "50%" }}>
					<div className="">
						<img
							src={message.fileUrl}
							alt="attachment"
							className='max-h-40 w-auto rounded cursor-pointer'
							onClick={openImageModal}
						/>
					</div>
					{showImageModal && (
						<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
							<div className="max-w-full max-h-full overflow-auto">
								<button className="absolute top-0 right-0 m-4 text-white text-lg" onClick={closeImageModal}>
									Close
								</button>
								<img
									src={message.fileUrl}
									alt="attachment"
									className="max-w-full max-h-full"
								/>
							</div>
						</div>
					)}
				</div>
			)}
			{message?.fileUrl && isPdf && (
				<div className='mt-2'>
					<div
						className='max-h-40 w-auto rounded cursor-pointer bg-gray-200 p-2'
						onClick={openPdfModal}
					>
						<p>PDF Document</p>
					</div>
					{showPdfModal && (
						<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
							<div className="max-w-full max-h-full overflow-auto">
								<button className="absolute top-0 right-0 m-4 text-white text-lg" onClick={closePdfModal}>
									Close
								</button>
								<div className="bg-white p-4 rounded">
									<Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js`}>
										<Viewer fileUrl={message.fileUrl} plugins={[defaultLayoutPluginInstance]} />
									</Worker>
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			<div className='chat-footer opacity-50 text-xs text-white flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;

function extractTime(dateString) {
	const date = new Date(dateString);
	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());
	return `${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
	return number.toString().padStart(2, "0");
}
