const express=  require('express');
const {authUser} = require('../middlewares/auth.middleware');
const {createChat,getUserChats} = require('../controllers/chat.controller')

const router = express.Router();


router.post('/',
    authUser,
    createChat
)

router.get(
  '/',
  authUser,
  getUserChats
);

module.exports=router;