import { Router } from "express";
import { getMessagesController } from "../controllers/message.controller";
import { authenticate } from "../middleware/auth.middleware";


const router = Router();


router.get(
  "/:roomId",
  authenticate,
  getMessagesController
);


export default router;