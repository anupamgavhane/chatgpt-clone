import React from 'react'
import './Sidebar.css'

const Sidebar = ({ chats, currentChatId, onSelectChat, onDeleteChat, onNewChat }) => {
  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation()
    onDeleteChat(chatId)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="chats-list">
        {chats.length === 0 ? (
          <div className="empty-chats">
            <p>No chats yet</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
              title={chat.title}
            >
              <span className="chat-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="chat-item-text">{chat.title}</span>
              <button
                className="chat-item-delete"
                onClick={(e) => handleDeleteClick(e, chat.id)}
                aria-label="Delete chat"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-user">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <div className="user-name">User</div>
            <div className="user-status">Free Plan</div>
          </div>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
