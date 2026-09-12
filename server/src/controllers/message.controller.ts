import { Request, Response } from "express";
import { getRoomMessages } from "../models/message.model";


export const getMessagesController = async(
  req:Request,
  res:Response
)=>{

  try{

    const roomId = Number(req.params.roomId);


    const messages = await getRoomMessages(roomId);


    return res.status(200).json({
      messages
    });


  }catch(error){

    console.error(error);


    return res.status(500).json({
      message:"Internal Server Error"
    });

  }

};