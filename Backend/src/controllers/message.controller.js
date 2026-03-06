const messageModel = require("../models/message.model");

async function getChatMessages(req, res) {
  try {

    const { chatId } = req.params;

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      text: msg.content,
      isUser: msg.role === "user",
      timestamp: msg.createdAt
    }));

    res.status(200).json(formattedMessages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}

module.exports = {
  getChatMessages
};