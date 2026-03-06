const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { getChatMessages } = require("../controllers/message.controller");

const router = express.Router();

router.get("/:chatId", authUser, getChatMessages);

module.exports = router;