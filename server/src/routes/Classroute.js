import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  addStudentToClass
} from "../contoller/Classcontroller.js";
import { authMiddleware } from "../middleware/auth.js";

const classroute = express.Router();

classroute.post("/addclass",authMiddleware, createClass);
classroute.get("/getclass",authMiddleware, getAllClasses);
classroute.get("/singleclass/:id",authMiddleware, getClassById);
classroute.put("/edit/:id",authMiddleware, updateClass);
classroute.delete("/delete/:id",authMiddleware, deleteClass);
classroute.post("/addinclass",authMiddleware, addStudentToClass);

export default classroute;
