import XLSX from "xlsx";
import fs from "fs";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";

export const importResults = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No Excel file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const resultsToInsert = [];

    for (const row of rows) {
      const { rollNo, className, examName, Remarks, ...subjectsData } = row;

      // 1️⃣ Find Student and Class
      const student = await Student.findOne({ rollNo });
      const classObj = await Class.findOne({ className });

      if (!student || !classObj) {
        console.warn(`⚠️ Skipping row - Student/Class not found: RollNo=${rollNo}, Class=${className}`);
        continue;
      }

      // 2️⃣ Extract subjects dynamically
      const subjects = Object.entries(subjectsData)
        .filter(([key]) => key.toLowerCase() !== "remarks")
        .map(([subjectName, obtainedMarks]) => ({
          subjectName,
          totalMarks: 100, // default; or add a "TotalMarks" column in Excel
          obtainedMarks: Number(obtainedMarks) || 0,
        }));

      // 3️⃣ Create result object
      resultsToInsert.push({
        student: student._id,
        class: classObj._id,
        examName,
        subjects,
        remarks: Remarks || "",
      });
    }

    // 4️⃣ Save all results
    const inserted = await Result.insertMany(resultsToInsert);

    // 5️⃣ Clean up file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: `${inserted.length} results imported successfully.`,
      data: inserted,
    });
  } catch (error) {
    console.error("Error importing results:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




// 🟢 Create Result
export const createResult = async (req, res) => {
  try {
    const { studentId, classId, examName, subjects, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const result = await Result.create({
      student: studentId,
      class: classId,
      examName,
      subjects,
      remarks,
    });

    res.status(201).json({ success: true, message: "Result added successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 Get All Results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name rollNumber class")
      .populate("class", "className section");

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔵 Get Result by Student Roll Number
export const getResultByRollNo = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const results = await Result.find({ student: student._id })
      .populate("class", "className section");

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟠 Update Result
export const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, message: "Result updated", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "Result not found" });
    res.json({ success: true, message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};