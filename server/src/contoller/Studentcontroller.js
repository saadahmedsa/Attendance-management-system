import Student from "../models/Student.js";
import Class from "../models/Class.js";



const generateRollNumber = async () => {
    const lastStudent = await Student.findOne().sort({ createdAt: -1 });
    let newNumber = 1;

    if (lastStudent && lastStudent.rollNumber) {
        const lastNum = parseInt(lastStudent.rollNumber.split("-")[1]);
        if (!isNaN(lastNum)) newNumber = lastNum + 1;
    }

    return `STU-${String(newNumber).padStart(3, "0")}`;
};


export const createStudent = async (req, res) => {
    try {
        const { email, className } = req.body;

        if (email) {
            const existing = await Student.findOne({ email });
            if (existing) {
                return res.status(400).json({ success: false, message: "Email already registered" });
            }
        }
        let classDoc = await Class.findOne({ className });
        if (!classDoc) {
                            return res.status(400).json({ success: false, message: "class not found" });

        }
        const rollNumber = await generateRollNumber();
        const image = req.file ? req.file.path : "";
        const student = await Student.create({
            ...req.body,
            rollNumber,
            class: classDoc._id,
            image,
        });
        await Class.findByIdAndUpdate(classDoc._id, { $push: { students: student._id } });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Get all students with pagination
export const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalStudents = await Student.countDocuments();
        const students = await Student.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: students,
            pagination: {
                total: totalStudents,
                page,
                limit,
                totalPages: Math.ceil(totalStudents / limit),
                hasNextPage: page * limit < totalStudents,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single student by ID
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a student
export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.status(200).json({ success: true, message: "Student updated successfully", data: student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};