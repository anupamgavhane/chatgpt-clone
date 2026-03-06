import { io } from "socket.io-client"

const socket = io("https://chatgpt-clone-y0jx.onrender.com/", {
  withCredentials: true,
  autoConnect:true
})

export default socket