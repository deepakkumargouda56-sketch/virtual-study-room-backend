import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import api from "../api/axios";
import DashboardCard from "../components/DashboardCard";

interface DashboardStats {
  roomsCreated: number;
  roomsJoined: number;
  activeRooms: number;
  totalStudyTime: number;
}

interface Room {
  id: number;
  name: string;
  description: string;
  max_members: number;
}

interface StudySession {
  id: number;
  room_id: number;
  duration: number;
  start_time: string;
  end_time: string;
}

const Dashboard = () => {

  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    roomsCreated: 0,
    roomsJoined: 0,
    activeRooms: 0,
    totalStudyTime: 0,
  });


  const [createdRooms, setCreatedRooms] = useState<Room[]>([]);

  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);

  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  

  useEffect(() => {
    fetchDashboard();
    fetchDashboardData();
  }, []);


  const fetchDashboard = async () => {
    try {

      const response = await api.get("/dashboard/stats");

      setStats(response.data.stats);

    } catch (error) {

      console.error(error);

    }
  };


  const fetchDashboardData = async () => {
    try {

      const response = await api.get("/dashboard/data");

      setCreatedRooms(response.data.createdRooms);

      setJoinedRooms(response.data.joinedRooms);

      setRecentSessions(response.data.recentSessions);

    } catch (error) {

      console.error(error);

    }
  };


  return (
    <Stack p="8" gap="8">


      <Heading>
        Dashboard
      </Heading>



      {/* Stats Cards */}

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap="6"
      >

        <DashboardCard
          title="Rooms Created"
          value={stats.roomsCreated}
        />


        <DashboardCard
          title="Rooms Joined"
          value={stats.roomsJoined}
        />


        <DashboardCard
          title="Active Rooms"
          value={stats.activeRooms}
        />


        <DashboardCard
          title="Study Time (min)"
          value={stats.totalStudyTime}
        />


      </SimpleGrid>




      {/* Created Rooms */}

    <Stack gap="4">

  <Heading size="md">
    My Created Rooms
  </Heading>


  {
    createdRooms.length === 0 ? (

      <Text>
        No rooms created yet
      </Text>

    ) : (

      createdRooms.map((room) => {

        return (
          <DashboardCard
            key={room.id}
            title={room.name}
            value={`${room.max_members} Members`}
            onClick={() => { 
              navigate(`/study-room/${room.id}`);
            }}
          />
        );

      })

    )
  }


</Stack>


      {/* Joined Rooms */}

   <Stack gap="4">

  <Heading size="md">
    Joined Rooms
  </Heading>


  {
    joinedRooms.length === 0 ? (

      <Text>
        No joined rooms
      </Text>

    ) : (

      joinedRooms.map((room) => {

        return (
          <DashboardCard
            key={room.id}
            title={room.name}
            value={`${room.max_members} Members`}
            onClick={() => {
              navigate(`/study-room/${room.id}`);
            }}
          />
        );

      })

    )
  }


</Stack>

{/* Recent Study Sessions */}

<Stack gap="4">

  <Heading size="md">
    Recent Study Sessions
  </Heading>


  {
    recentSessions.length === 0 ? (

      <Text>
        No study sessions found
      </Text>

    ) : (

      recentSessions.map((session) => (

        <DashboardCard
          key={session.id}
          title={`Room ID: ${session.room_id}`}
          value={`${session.duration} minutes`}
        />

      ))

    )
  }


</Stack>


    </Stack>
  );
};


export default Dashboard;