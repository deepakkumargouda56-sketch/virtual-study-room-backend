import db from "../config/database";


export const createMessage = async (
  roomId:number,
  userId:number,
  message:string
)=>{

  const [result]:any = await db.query(

    `
    INSERT INTO messages
    (room_id,user_id,message)
    VALUES (?,?,?)
    `,

    [
      roomId,
      userId,
      message
    ]

  );


  return result.insertId;

};




export const getRoomMessages = async (
  roomId:number
)=>{


  const [rows]:any = await db.query(

    `
    SELECT 
    messages.id,
    messages.message,
    messages.created_at,
    users.name

    FROM messages

    JOIN users
    ON messages.user_id = users.id

    WHERE room_id = ?

    ORDER BY messages.created_at ASC

    `,

    [
      roomId
    ]

  );


  return rows;

};