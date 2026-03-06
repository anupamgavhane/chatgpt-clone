const {Server} = require("socket.io")
const cookie=require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");
const{ generateResponse,generateVector} = require('../services/ai.service')
const messageModel = require('../models/message.model')
const {createMemory,queryMemory} = require('../services/vector.service');
const { text } = require("express");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
})

    io.use(async(socket,next) =>{
        try{
            const cookies= cookie.parse(socket.handshake.headers?.cookie || "");
            if(!cookies.token){
                return next(new Error("Authentication Error: No token provided"))
            }
            const decoded = jwt.verify(cookies.token,process.env.JWT_SECRET);
            const user =await userModel.findById(decoded.id);

            if(!user){
                return next(new Error("Authentication Error: No user found"))
            }
            socket.user = user;
        
        next();
        }catch(err){
            return next(new Error("Socket connection error: ",err));
        }
        
    })


io.on("connection", (socket) => {

  socket.on("ai-message", async (messagePayload) => {
    try {
      console.log("RAW PAYLOAD >>>", messagePayload);
      

      // ✅ Normalize input
      let payload = messagePayload;

if (typeof payload === "string") {
  payload = JSON.parse(payload);
}

const { chat, content } = payload;

      if (!content || typeof content !== "string") {
        return socket.emit("ai-response", {
          content: "Invalid message payload",
          chat: chat
        });
      }





//Saving message to the db , generating the vector and saving message to the pinecone
      const [message , vectors] = await Promise.all([

        messageModel.create({
        chat:chat,
        user:socket.user._id,
        content:content,
        role:"user"
      }),

       generateVector(content),

       

      ])

      await createMemory({
        vectors,
        messageId:message._id,
        metadata:{
          chat:chat,
          user:socket.user._id.toString(),
          text:content,
          role:"user"
        }
      });
      





      console.log(vectors)
      console.log("VECTOR CHECK:", vectors?.length);






      const [memory , messages] =await  Promise.all([

        queryMemory({
        queryVector: vectors,
        limit:8,
        metadata : {
          user:socket.user._id.toString()
        }
      }),

      messageModel.find({
        chat:chat
      }).sort({createdAt:-1}).limit(4).lean()
      ])

    const chatHistory = messages.reverse();

     

      

      console.log(memory)

      

      const shortTermMemory = chatHistory.map(item=>{
        return {
            role:item.role,
            parts:[{text: item.content}]
        }
      })

      const longTermMemory = [
        {
          role:"user",
          parts:[{
            text:
            `Context from previous chat messages
            ${memory.map(item=>item.metadata.text).join("\n")}`
          }]
        }
      ]
      console.log(longTermMemory,shortTermMemory)
      const response = await generateResponse([...longTermMemory,...shortTermMemory]);



      

      socket.emit("ai-response", {
        content: response,
        chat: chat
      });



      const [responseMessage,responseVectors]= await Promise.all([
        messageModel.create({
        chat:chat,
        user:socket.user._id,
        content:response,
        role:"model"
      }),
        generateVector(response)
      ])


      await createMemory({
        vectors:responseVectors,
        messageId:responseMessage._id,
        metadata: {
          chat:chat,
          user:socket.user._id,
          text:response
        }
      })

    } catch (err) {
  console.error("Socket AI error:", err);

  socket.emit("ai-response", {
    content: "AI failed to respond",
    chat: messagePayload?.chat
  });
}
  });

});

}

module.exports=initSocketServer