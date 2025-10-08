import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  assignClassToTeacher,
} from "../contoller/Teachercontroller.js";

const router = express.Router();

router.post("/addteacher", createTeacher);
router.get("/Allteacher", getAllTeachers);
router.get("/singleteacher/:id", getTeacherById);
router.put("/updateteacher/:id", updateTeacher);
router.delete("/deleteteacher/:id", deleteTeacher);
router.post("/assign-class", assignClassToTeacher);


const teacherouter = router;
export default teacherouter;
