import { useState } from 'react'
import './App.css'
import AppRoutes from './AppRoutes'
import { ThemeProvider } from './context/ThemeContext'
import { Provider as ReduxProvider } from 'react-redux'
import store from './store/store'

function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default App
