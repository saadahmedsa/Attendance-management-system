import express from "express";
import { markAttendanceByRollNo, getAttendanceByRollNo } from "../contoller/Attendacecontroller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/markattendance", authMiddleware, markAttendanceByRollNo);

router.get("/attendancebyrollno", getAttendanceByRollNo);

const attendance = router;
export default attendance;

