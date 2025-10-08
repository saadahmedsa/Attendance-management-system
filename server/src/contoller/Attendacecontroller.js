import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

export const markAttendanceByRollNo = async (req, res) => {
  try {
    const { rollNumber,date} = req.body;

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found with this roll number" });
    }

    const existing = await Attendance.findOne({ student: student._id, date });
    if (existing) {
      return res.status(400).json({ success: false, message: "Attendance already marked for this date" });
    }

    const attendance = new Attendance({
      student: student._id,
      ...req.body
      
    });
    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAttendanceByRollNo = async (req, res) => {
  try {
    const { rollNumber, startDate, endDate } = req.query;

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found with this roll number" });
    }

    const filter = { student: student._id };
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

  const records = await Attendance.find(filter, { date: 1, status: 1, _id: 0 }).sort({ date: -1 });
    const summary = {
      Present: records.filter(r => r.status === "Present").length,
      Absent: records.filter(r => r.status === "Absent").length,
      Late: records.filter(r => r.status === "Late").length
    };

    res.json({
      success: true,
      student: {
        name: student.name,
        rollNumber: student.rollNumber
      },
      totalRecords: records.length,
      summary,
      records
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
