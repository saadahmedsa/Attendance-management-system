import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";

export const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, gender, address, subjects, classes } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const teacher = await Teacher.create({
      name,
      email,
      phone,
      gender,
      address,
      subjects,
      classes,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("classes", "className section")
    res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate("classes", "className section");
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, message: "Teacher updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Teacher.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Assign a class to a teacher
export const assignClassToTeacher = async (req, res) => {
  try {
    const { teacherId, classId } = req.body;

    const teacher = await Teacher.findById(teacherId);
    const classData = await Class.findById(classId);

    if (!teacher || !classData) {
      return res.status(404).json({ success: false, message: "Teacher or Class not found" });
    }

    // Add class to teacher
    if (!teacher.classes.includes(classId)) {
      teacher.classes.push(classId);
      await teacher.save();
    }

    // Set class teacher reference
    classData.classTeacher = teacherId;
    await classData.save();

    res.status(200).json({
      success: true,
      message: "Class assigned to teacher successfully",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
