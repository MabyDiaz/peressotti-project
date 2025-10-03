import { Router } from 'express';
import { chatQuery } from '../controllers/chatbot.controller.js';

const router = Router();
router.post('/chat-query', chatQuery);
export default router;
