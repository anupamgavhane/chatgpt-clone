import React, { useState, useRef, useEffect } from 'react'
import './NewChatDialog.css'

const NewChatDialog = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onCreate(title.trim())
      setTitle('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>New Chat</h2>
          <button
            className="dialog-close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="form-group">
            <label htmlFor="chat-title">Chat Title</label>
            <input
              ref={inputRef}
              id="chat-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a chat title..."
              className="dialog-input"
            />
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              Create Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewChatDialog
