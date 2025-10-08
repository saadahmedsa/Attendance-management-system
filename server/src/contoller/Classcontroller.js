import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

// ✅ Create a new class
export const createClass = async (req, res) => {
  try {
    const { className, section, classTeacher, subjects } = req.body;

    // Check if class already exists
    const existingClass = await Class.findOne({ className, section });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "Class with this name and section already exists",
      });
    }

    const newClass = await Class.create({
      className,
      section,
      classTeacher,
      subjects,
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("classTeacher", "name email")
      .populate("students", "name rollNumber email");

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await Class.findById(id)
      .populate("classTeacher", "name email")
      .populate("students", "name rollNumber email");

    if (!classData) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.status(200).json({ success: true, data: classData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update class details
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true })
      .populate("classTeacher", "name email")
      .populate("students", "name rollNumber email");

    if (!updatedClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    res.status(200).json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add student to a class
export const addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (classData.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student already added" });
    }

    classData.students.push(studentId);
    await classData.save();

    res.status(200).json({ success: true, message: "Student added to class", data: classData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
