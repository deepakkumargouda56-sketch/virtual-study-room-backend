import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toaster } from "../components/Toaster";
import PremiumCard from "../components/PremiumCard";
import {
  Heading,
  Stack,
  Text,
  Button,
  Input,
  Textarea,
  Spinner,
  SimpleGrid,
  HStack,
  Dialog,
} from "@chakra-ui/react";

import api from "../api/axios";

const token = localStorage.getItem("token");

const userId = token
  ? JSON.parse(atob(token.split(".")[1])).id
  : null;
  console.log("Logged User ID:", userId);

interface Room {
  id: number;
  name: string;
  description: string;
  max_members: number;
  created_by: number;
}



const Rooms = () => {


  const navigate = useNavigate();


  const [rooms,setRooms] = useState<Room[]>([]);


  const [name,setName] = useState("");

  const [description,setDescription] = useState("");

  const [maxMembers,setMaxMembers] = useState(10);


  const [loading,setLoading] = useState(false);

  const [joiningRoom,setJoiningRoom] = useState<number | null>(null);

  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null);



  useEffect(()=>{

    fetchRooms();

  },[]);





  const fetchRooms = async()=>{


    try{


      setLoading(true);


      const response = await api.get("/rooms");


      setRooms(response.data.rooms);



    }catch(error){


      console.error("Room error:", error);

      toaster.create({

        title:"Failed to load rooms",

        type:"error",

      });


    }finally{


      setLoading(false);

    }


  };






  const createRoom = async()=>{


    if(!name){


      toaster.create({

        title:"Room name required",

        type:"warning",

      });


      return;

    }



    try{


      setLoading(true);



      await api.post("/rooms/create",{

        name,

        description,

        max_members:maxMembers,

      });



      toaster.create({

        title:"Room created successfully",

        type:"success",

      });



      setName("");

      setDescription("");

      setMaxMembers(10);



      fetchRooms();



    }catch(error){


      console.error("Room error:", error);

      toaster.create({

        title:"Room creation failed",

        type:"error",

      });



    }finally{


      setLoading(false);

    }


  };







  const joinRoom = async(id:number)=>{


    try{


      setJoiningRoom(id);



      await api.post(`/rooms/${id}/join`);




      toaster.create({

        title:"Joined room successfully",

        type:"success",

      });



      navigate(`/study-room/${id}`);




    }catch(error){


     console.error("Room error:", error);



      toaster.create({

        title:"Unable to join room",

        type:"error",

      });



    }finally{


      setJoiningRoom(null);

    }


  };


  const editRoom = async (room: Room) => {

  const name = prompt("Enter new room name", room.name);

  if (!name) return;


  const description = prompt(
    "Enter new description",
    room.description
  );

  if (!description) return;


  const max_members = Number(
    prompt(
      "Enter maximum members",
      room.max_members.toString()
    )
  );


  try {

    await api.put(`/rooms/${room.id}`, {
      name,
      description,
      max_members,
    });


    toaster.create({
      title:"Room updated successfully",
      type:"success",
    });


    fetchRooms();


  } catch(error) {

    console.error(error);

    toaster.create({
      title:"Failed to update room",
      type:"error",
    });

  }

};



  const deleteRoom = async (id:number)=>{

  try{

    await api.delete(`/rooms/${id}`);

    toaster.create({
      title:"Room deleted successfully",
      type:"success",
    });

    fetchRooms();

  }catch(error){

    console.error("Delete room error:", error);

    toaster.create({
      title:"Unable to delete room",
      type:"error",
    });

  }

};



return (

<Stack

p="8"

gap="8"

>



<Heading>

📚 Study Rooms

</Heading>





{/* CREATE ROOM */}


<PremiumCard>


<Stack gap="5">


<Heading size="lg">

🚀 Create New Study Room

</Heading>



<Input

placeholder="Room name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>




<Textarea

placeholder="Room description"

value={description}

onChange={(e)=>setDescription(e.target.value)}

/>




<Input

type="number"

value={maxMembers}

onChange={(e)=>setMaxMembers(Number(e.target.value))}

/>





<Button

colorPalette="blue"

onClick={createRoom}

disabled={loading}

>


{

loading ?

<Spinner size="sm"/>

:

"Create Room"

}


</Button>


</Stack>


</PremiumCard>







<Heading size="lg">

🌎 Available Rooms

</Heading>






{

loading ?


(

<PremiumCard>


<Stack align="center">

<Spinner/>

<Text>

Loading rooms...

</Text>

</Stack>


</PremiumCard>

)



:

rooms.length===0 ?


(

<PremiumCard>

<Text>

No rooms available

</Text>

</PremiumCard>

)



:

(


<SimpleGrid

columns={{base:1,md:2}}

gap="6"

>


{
rooms.map((room)=>(
  console.log("Room Data:", room),

<PremiumCard key={room.id}>

<Stack gap="4">


<Heading size="md">
{room.name}
</Heading>


<Text>
{room.description}
</Text>


<Text>
👥 Maximum Members : {room.max_members}
</Text>



<Button

colorPalette="blue"

width="full"

onClick={()=>joinRoom(room.id)}

disabled={joiningRoom===room.id}

>

{

joiningRoom===room.id

?

<Spinner size="sm"/>

:

"Join Room"

}

</Button>



{
room.created_by === userId && (

<Stack

pt="3"

borderTopWidth="1px"

gap="3"

>


<Text

fontSize="sm"

color="gray.500"

>

Room Owner Actions

</Text>

<Button

variant="outline"

colorPalette="blue"

width="full"

onClick={()=>editRoom(room)}

>

✏️ Edit Room

</Button>


<Button

variant="outline"

colorPalette="red"

width="full"

onClick={()=>setDeleteRoomId(room.id)}

>

🗑️ Delete Room

</Button>



</Stack>

)

}



</Stack>

</PremiumCard>

))
}



</SimpleGrid>


)

}


<Dialog.Root
  open={deleteRoomId !== null}
  onOpenChange={(e)=> {
    if(!e.open){
      setDeleteRoomId(null);
    }
  }}
>

<Dialog.Backdrop />

<Dialog.Positioner>

<Dialog.Content
  borderRadius="2xl"
  p="2"
  shadow="2xl"
>

<Dialog.Header>
  <Stack gap="2">

    <Dialog.Title>
      🗑️ Delete Room
    </Dialog.Title>

    <Text color="gray.500" fontSize="sm">
      Remove this study room permanently
    </Text>

  </Stack>
</Dialog.Header>


<Dialog.Body>

<PremiumCard>

<Text>
  ⚠️ Are you sure you want to delete this room?
</Text>

<Text
mt="2"
color="gray.500"
fontSize="sm"
>
All members will lose access and this action cannot be undone.
</Text>

</PremiumCard>

</Dialog.Body>

<Dialog.Footer>

<HStack width="full" justify="end">

<Button
variant="outline"
borderRadius="xl"
onClick={()=>{
 setDeleteRoomId(null);
}}
>
Cancel
</Button>


<Button
colorPalette="red"
borderRadius="xl"
onClick={()=>{
 if(deleteRoomId){
   deleteRoom(deleteRoomId);
 }
 setDeleteRoomId(null);
}}
>
🗑️ Delete Room
</Button>

</HStack>

</Dialog.Footer>

</Dialog.Content>

</Dialog.Positioner>

</Dialog.Root>



</Stack>

);



};




export default Rooms;