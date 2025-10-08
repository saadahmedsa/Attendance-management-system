import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: { 
    type: String, required: true
 },
  section: { type: String },
  classTeacher: {
     type: mongoose.Schema.Types.ObjectId, ref: "Teacher"
     },
  subjects: [{ 
    type: String
 }],
  students: [{
     type: mongoose.Schema.Types.ObjectId, ref: "Student"
     }],
});

export default mongoose.model("Class", classSchema);
