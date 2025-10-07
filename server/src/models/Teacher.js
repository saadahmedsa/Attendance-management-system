import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  address: { type: String, trim: true },
  joiningDate: { type: Date, default: Date.now },
  subjects: [{ type: String, trim: true }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
