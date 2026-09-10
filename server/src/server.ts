import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { socketAuth } from "./middleware/socketAuth.middleware";
import { createStudySession } from "./models/studySession.model";
import { createMessage } from "./models/message.model";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(socketAuth);


const onlineUsers = new Map<
  string,
  {
    userId: number;
    userName: string;
    roomId: number;
  }
>();


const studySessions = new Map<string, number>();


// Currently studying users
const activeStudyingUsers = new Map<
  string,
  {
    userName: string;
    roomId: number;
  }
>();


const getOnlineUsers = (roomId: number) => {

  const users: {
    id: number;
    name: string;
  }[] = [];


  for (const [, user] of onlineUsers) {

    if (user.roomId === roomId) {

      users.push({
        id: user.userId,
        name: user.userName,
      });

    }

  }

  return users;

};



const formatDuration = (milliseconds:number)=>{

  const seconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const remainingSeconds = seconds % 60;


  return {
    hours,
    minutes,
    seconds: remainingSeconds
  };

};



io.on("connection",(socket)=>{


console.info("Socket user connected");


socket.on(
"join-room",
(data:{roomId:number})=>{


const user = (socket as any).user;


socket.join(`room-${data.roomId}`);



onlineUsers.set(socket.id,{

 userId:user.id,

 userName:user.name,

 roomId:data.roomId

});



const users = getOnlineUsers(data.roomId);



io.to(`room-${data.roomId}`).emit(
"online-users",
{
 users
}
);



socket.emit("joined-room",{

message:`Successfully joined room-${data.roomId}`

});

const studyingUsers = [];

for (const [, studyUser] of activeStudyingUsers) {

  if (studyUser.roomId === data.roomId) {

    studyingUsers.push({
      userName: studyUser.userName
    });

  }

}


socket.emit("current-studying-users", {
  users: studyingUsers
});



});


// CHAT MESSAGE

socket.on(
  "send-message",
  async(data:{
    roomId:number;
    message:string;
  })=>{


    const user = (socket as any).user;


    if(!user) return;


    await createMessage(
      data.roomId,
      user.id,
      data.message
    );


    io.to(`room-${data.roomId}`).emit(
      "receive-message",
      {
        userName:user.name,
        message:data.message,
        createdAt:new Date()
      }
    );


  }
);




// START STUDY

socket.on("start-study",()=>{


const user = onlineUsers.get(socket.id);


if(!user) return;



studySessions.set(
socket.id,
Date.now()
);



activeStudyingUsers.set(socket.id,{

userName:user.userName,

roomId:user.roomId

});





io.to(`room-${user.roomId}`)
.emit(
"user-started-study",
{

userName:user.userName,
startTime: Date.now(),

}

);



});







// STOP STUDY

socket.on(
"stop-study",
async()=>{


const startTime = studySessions.get(socket.id);



if(!startTime){

console.warn("Study session not found");

return;

}



const duration = Date.now()-startTime;



const user = onlineUsers.get(socket.id);



if(user){


await createStudySession(

user.userId,

user.roomId,

new Date(startTime),

new Date(),

Math.floor(duration/1000)

);



io.to(`room-${user.roomId}`)
.emit(
"user-stopped-study",
{
userName:user.userName
}
);



activeStudyingUsers.delete(socket.id);



}



socket.emit(
"study-completed",
{
duration:formatDuration(duration)
}
);



studySessions.delete(socket.id);



});







// DISCONNECT

socket.on(
"disconnect",
()=>{


const user = onlineUsers.get(socket.id);


const roomId = user?.roomId;



activeStudyingUsers.delete(socket.id);



onlineUsers.delete(socket.id);



if(roomId){

io.to(`room-${roomId}`)
.emit(
"online-users",
{
users:getOnlineUsers(roomId)
}
);

}



console.info("Socket user disconnected");



});



});


server.listen(PORT,()=>{

console.info(`Server started on port ${PORT}`);

});
