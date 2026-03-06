import React from 'react'
import MessageList from './MessageList'
import './ChatWindow.css'

const ChatWindow = ({ messages, onSendMessage, isLoading, children }) => {
  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <div className="chat-input-wrapper">
        {children}
      </div>
    </div>
  )
}

export default ChatWindow
