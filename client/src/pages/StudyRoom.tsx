import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket/socket";
import { toaster } from "../components/Toaster";
import PremiumCard from "../components/PremiumCard";

import {
  Heading,
  Stack,
  Text,
  Button,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";

import api from "../api/axios";


interface Room {
  id:number;
  name:string;
  description:string;
  max_members:number;
}


interface Member {
  id:number;
  name:string;
  email:string;
}


interface OnlineUser {
  id:number;
  name:string;
}



const StudyRoom =()=>{


const {id}=useParams();

const navigate=useNavigate();


const [room,setRoom]=useState<Room|null>(null);

const [members,setMembers]=useState<Member[]>([]);

const [onlineUsers,setOnlineUsers]=useState<OnlineUser[]>([]);

const [studyingUsers,setStudyingUsers]=useState<string[]>([]);



useEffect(()=>{


fetchRoom();

fetchMembers();



socket.auth={
 token:localStorage.getItem("token"),
};



socket.connect();



socket.on("online-users",(data)=>{

setOnlineUsers(data.users);

});




socket.on("study-completed",(data)=>{


toaster.create({

title:"Study completed",

description:
`${data.duration.hours}h ${data.duration.minutes}m ${data.duration.seconds}s`,

type:"success",

});


});




socket.on("user-started-study",(data)=>{


setStudyingUsers(prev=>{

if(prev.includes(data.userName))
return prev;


return [
...prev,
data.userName
];

});


});




socket.on("user-stopped-study",(data)=>{


setStudyingUsers(prev=>

prev.filter(
name=>name!==data.userName
)

);


});




socket.on("current-studying-users",(data)=>{


setStudyingUsers(

data.users.map(
(user:any)=>user.userName
)

);


});




socket.emit("join-room",{

roomId:Number(id)

});





return ()=>{


socket.off("online-users");

socket.off("study-completed");

socket.off("user-started-study");

socket.off("user-stopped-study");

socket.off("current-studying-users");


socket.disconnect();


};


},[]);






const fetchRoom=async()=>{

try{

const response=
await api.get(`/rooms/${id}`);

setRoom(response.data.room);


}catch(error){

console.error("Study room error:", error);

}

};







const fetchMembers=async()=>{

try{

const response=
await api.get(`/rooms/${id}/members`);

setMembers(response.data.members);


}catch(error){

console.error("Study room error:", error);

}

};






const startStudy=()=>{

socket.emit("start-study");


toaster.create({

title:"Study started 📚",

type:"success",

});


};





const stopStudy=()=>{

socket.emit("stop-study");

};






const leaveRoom=async()=>{


try{


await api.post(`/rooms/${id}/leave`);


socket.disconnect();



toaster.create({

title:"Left room successfully",

type:"success",

});



navigate("/rooms");



}catch(error){


toaster.create({

title:"Unable to leave room",

type:"error",

});


}


};






return (


<Stack

p="8"

gap="8"

minH="100vh"

bgGradient="linear(to-br, blue.50, purple.50)"

>



<Heading>

📚 Study Room

</Heading>







{
room &&


<PremiumCard>


<Stack gap="3">


<Heading size="lg">

{room.name}

</Heading>



<Text>

{room.description}

</Text>



<Badge>

👥 Max Members: {room.max_members}

</Badge>



</Stack>


</PremiumCard>

}









<SimpleGrid

columns={{base:1,md:2}}

gap="6"

>




<PremiumCard>


<Heading size="md">

👥 Members ({members.length})

</Heading>



<Stack mt="4">


{

members.length===0

?

<Text>
No members
</Text>


:


members.map(member=>(


<Text key={member.id}>

👤 {member.name}

</Text>


))


}



</Stack>



</PremiumCard>







<PremiumCard>


<Heading size="md">

🟢 Online Now

</Heading>



<Stack mt="4">


{

onlineUsers.length===0

?


<Text>
Nobody online
</Text>


:


onlineUsers.map(user=>(


<Text key={user.id}>

🟢 {user.name}

</Text>


))


}



</Stack>



</PremiumCard>




</SimpleGrid>









<PremiumCard>


<Heading size="md">

📚 Studying Now

</Heading>



<Stack mt="4">


{

studyingUsers.length===0

?


<Text>

Nobody is studying

</Text>


:


studyingUsers.map(name=>(


<Text key={name}>

📚 {name} is studying

</Text>


))


}



</Stack>



</PremiumCard>









<SimpleGrid

columns={{base:1,md:3}}

gap="4"

>


<Button

colorPalette="green"

size="lg"

borderRadius="xl"

onClick={startStudy}

>

▶ Start Study

</Button>





<Button

colorPalette="blue"

size="lg"

borderRadius="xl"

onClick={stopStudy}

>

⏹ End Study

</Button>





<Button

colorPalette="red"

size="lg"

borderRadius="xl"

onClick={leaveRoom}

>

Leave Room

</Button>




</SimpleGrid>






</Stack>


);


};


export default StudyRoom;