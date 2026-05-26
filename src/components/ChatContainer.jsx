import { useEffect, useRef } from "react"
import { useAuthStore } from "../store/useAuthStore.js"
import { useChatStore } from "../store/useChatStore.js"
import Header from "./Header.jsx"
import MessageInput from "./MessageInput.jsx"
import MessageLoading from "./MessageLoading.jsx"
import { formatMessageTime } from "../lib/utils.js"
import { FileText } from "lucide-react"

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  const { authUser, } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <MessageLoading />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.picture ||
                        `https://ui-avatars.com/api/?name=${authUser.fullName}&background=random`
                      : selectedUser.picture ||
                        `https://ui-avatars.com/api/?name=${selectedUser.fullName}&background=random`
                  }
                  alt="profile image"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {message.pdf && (
                <a
                  href={message.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-base-300 hover:bg-base-200 text-base-content p-3 rounded-md mb-2 transition-colors"
                >
                  <FileText className="text-blue-500" size={24} />
                  <span className="text-sm font-medium underline">
                    Buka Dokumen PDF
                  </span>
                </a>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer