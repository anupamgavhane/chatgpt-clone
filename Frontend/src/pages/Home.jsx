import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import NewChatDialog from '../components/NewChatDialog'
import { createChatAsync, selectChat, fetchChatsAsync, deleteChatAsync } from '../store/slices/chatSlice'
import { addMessage, setLoading } from '../store/slices/messagesSlice'
import '../styles/Home.css'
import axios from "axios"
import socket from "../socket"
import { loadMessagesForChat } from "../store/slices/messagesSlice"

const Home = () => {
  const dispatch = useDispatch()
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const EMPTY_MESSAGES = []

  // Redux selectors
  const chats = useSelector(state => state.chats.chats)
  const currentChatId = useSelector(state => state.chats.currentChatId)
  const chatsLoading = useSelector(state => state.chats.loading)
  const chatsError = useSelector(state => state.chats.error)
  const messages = useSelector(state => {
    
    return state.messages.messagesByChatId[currentChatId] || EMPTY_MESSAGES
  })
  const isLoading = useSelector(state => state.messages.isLoading)

  const currentChat = chats.find(chat => chat.id === currentChatId)




  // Fetch all user chats on component mount
  useEffect(() => {
  dispatch(fetchChatsAsync());
}, [dispatch]);


  useEffect(() => {
  if (!currentChatId) return;

  const loadMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/messages/${currentChatId}`,
        { withCredentials: true }
      );

      dispatch(loadMessagesForChat({
        chatId: currentChatId,
        messages: res.data
      }));
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  loadMessages();
}, [currentChatId]);

useEffect(() => {

  socket.on("ai-response", (data) => {

    const aiMessage = {
      id: Date.now(),
      text: data.content,
      isUser: false,
      timestamp: Date.now(),
    }

    dispatch(addMessage({
      chatId: data.chat,
      message: aiMessage
    }))

    dispatch(setLoading(false))

  })

  return () => {
    socket.off("ai-response")
  }

}, [dispatch])

  const handleSendMessage = (text) => {
  if (!currentChatId) return

  const userMessage = {
    id: Date.now(),
    text,
    isUser: true,
    timestamp: Date.now(),
  }

  dispatch(addMessage({ chatId: currentChatId, message: userMessage }))
  dispatch(setLoading(true))

  socket.emit("ai-message", {
    chat: currentChatId,
    content: text
  })
}

  const handleNewChat = () => {
    setShowNewChatDialog(true)
  }

  const handleCreateChat = (title) => {
    dispatch(createChatAsync(title))
    setShowNewChatDialog(false)
  }

  const handleSelectChat = async (chatId) => {

  dispatch(selectChat(chatId))

  try {

    const res = await axios.get(
      `http://localhost:3000/api/messages/${chatId}`,
      { withCredentials: true }
    )

    dispatch(loadMessagesForChat({
      chatId,
      messages: res.data
    }))

  } catch (err) {
    console.error("Failed to load messages", err)
  }
}

  const handleDeleteChat = (chatId) => {
    dispatch(deleteChatAsync(chatId))
  }

  return (
    <div className="chat-container">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        isLoading={chatsLoading}
      />
      <ChatWindow messages={messages}>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </ChatWindow>
      {showNewChatDialog && (
        <NewChatDialog
          onCreate={handleCreateChat}
          onCancel={() => setShowNewChatDialog(false)}
        />
      )}
      {chatsError && (
        <div className="error-notification">
          <p>{chatsError}</p>
        </div>
      )}
    </div>
  )
}

export default Home
