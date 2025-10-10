
import multer from "multer";
import express from "express";
import {
  createResult,
  getAllResults,
  getResultByRollNo,
  updateResult,
  deleteResult,
  importResults
} from "../contoller/Resultcontroller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/import", upload.single("file"), importResults);
router.post("/addresult", createResult);
router.get("/Allresult", getAllResults);
router.get("/result/:rollNumber", getResultByRollNo);
router.put("/updateresult/:id", updateResult);
router.delete("/deleteresult/:id", deleteResult);

export default router;
