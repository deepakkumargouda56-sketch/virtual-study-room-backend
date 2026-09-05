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
} from "@chakra-ui/react";

import api from "../api/axios";


interface Room {
  id: number;
  name: string;
  description: string;
  max_members: number;
}



const Rooms = () => {


  const navigate = useNavigate();


  const [rooms,setRooms] = useState<Room[]>([]);


  const [name,setName] = useState("");

  const [description,setDescription] = useState("");

  const [maxMembers,setMaxMembers] = useState(10);


  const [loading,setLoading] = useState(false);

  const [joiningRoom,setJoiningRoom] = useState<number | null>(null);



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




</Stack>


</PremiumCard>


))


}



</SimpleGrid>


)

}



</Stack>


);


};


export default Rooms;