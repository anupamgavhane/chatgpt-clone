const chatModel = require('../models/chat.model')

async function createChat(req,res){
    const {title} = req.body
    const user = req.user;


    const chat = await chatModel.create({
        user:user._id,
        title
    });

    res.status(201).json({
        message:"Chat created successfully",
        chat:{
            id:chat._id,
            title:chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });
}

async function getUserChats(req, res) {
  const user = req.user;

  const chats = await chatModel
    .find({ user: user._id })
    .sort({ lastActivity: -1 });

  const formattedChats = chats.map(chat => ({
    id: chat._id,
    title: chat.title,
    lastActivity: chat.lastActivity,
    user: chat.user
  }));

  res.status(200).json(formattedChats);
}

module.exports = {createChat,getUserChats}