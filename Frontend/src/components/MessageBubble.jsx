import React from 'react'
import './MessageBubble.css'

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="message-content">
        {message.text}
      </div>
      <div className="message-time">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  )
}

export default MessageBubble
