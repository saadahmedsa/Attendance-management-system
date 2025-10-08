import mongoose from "mongoose";



const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fathername: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true, unique: true, lowercase: true, trim: true
    },
    rollNumber: {
        type: String,
        required: true, unique: true, trim: true
    },
    class: {
        type: String,
        required: true, trim: true
    },
    image: { type: String, default: "" },
    section:{
        type: String,
        trim: true
    },
    dob: { type: Date },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    isActive:
    {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// StudentSchema.index({ rollNumber: 1 });
// StudentSchema.index({ email: 1 });
// StudentSchema.index({ class: 1, section: 1 });

const Student = mongoose.model('Student', StudentSchema);

export default Student;
