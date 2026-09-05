import { Request, Response } from "express";
import { 
 getDashboardStats,
 getCreatedRooms,
 getJoinedRooms
} from "../models/dashboard.model";

import { getRecentStudySessions
} from "../models/studySession.model";

export const getDashboardStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    // Logged-in user ID
    const userId = (req as any).user.id;

    // Fetch dashboard statistics
    const stats = await getDashboardStats(userId);

    return res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      stats,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


  export const getDashboardDataController = async(
req:Request,
res:Response
)=>{

try{

const userId=(req as any).user.id;


const createdRooms =
await getCreatedRooms(userId);


const joinedRooms =
await getJoinedRooms(userId);


const sessions =
await getRecentStudySessions(userId);



res.status(200).json({

createdRooms,
joinedRooms,
recentSessions:sessions

});


}
catch(error){

console.error("Dashboard error:", error);

res.status(500).json({
message:"Internal Server Error"
});

}

};