import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import allRoutes from "./routes/index.routes.js";
import TimelineRoutes from "./routes/timeline.route.js"
import LikesRoutes from "./routes/likes.route.js"
import RepostsRoute from "./routes/reposts.routes.js"
dotenv.config()

const server = express();
const PORT = process.env.PORT || 5000;

server
    .use(express.json())
    .use(cors())
    .use(allRoutes)
    .use(TimelineRoutes)
    .use(LikesRoutes)
    .use(RepostsRoute)

server.get("/status", (req, res) => {
  res.send("server it's on");
});

server.listen(PORT, () => {
  console.log(`Server listen on PORT ${PORT}`);
});
