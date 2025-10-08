import expresss from "express"
import { createStudent, deleteStudent, getAllStudents, getStudentById, updateStudent } from "../contoller/Studentcontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/multer.js";



const Student = expresss.Router();


Student.post("/addstudent",upload.single("image"),createStudent)
Student.get("/getallstudent",authMiddleware ,getAllStudents)
Student.get("/getsingle/:id", getStudentById)
Student.put("/update/:id",updateStudent)
Student.delete("/delete/:id",deleteStudent)



export default Student