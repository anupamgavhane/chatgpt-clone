import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import './MessageList.css'

const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <h1>Welcome to ChatGPT Clone</h1>
          <p>Start a new conversation or select a previous chat to continue</p>
        </div>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          message={msg}
          isUser={msg.isUser}
        />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  )
}

export default MessageList
