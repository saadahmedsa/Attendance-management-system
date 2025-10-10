import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors"
import connectDB from "./src/db/index.js";
import cookieParser from "cookie-parser";
import user from "./src/routes/userroute.js";
import Student from "./src/routes/Studentroute.js";
import classroute from "./src/routes/Classroute.js";
import teacherouter from "./src/routes/Teacherroute.js";
import attendance from "./src/routes/Attendanceroute.js";
import router from "./src/routes/Resultroute.js";



const app = express();

app.use(cors());

// 👇 These must come BEFORE your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello ams app !");
});

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});
app.use("/api", user);
app.use("/api", Student);
app.use("/api", classroute);
app.use("/api", teacherouter);
app.use("/api", attendance);
app.use("/api", router);



connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  })
