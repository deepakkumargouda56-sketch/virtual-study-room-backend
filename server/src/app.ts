import express from "express";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import messageRoutes from "./routes/message.routes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://virtual-study-room-frontend-ivory.vercel.app",
      "https://virtual-study-room-frontend-git-main-deepak-a429.vercel.app"
    ],
    credentials: true,
  })
);

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Virtual Study Room API is running 🚀");
});

export default app;