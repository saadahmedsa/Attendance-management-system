import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  examName: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [
    {
      subjectName: { type: String, required: true },
      totalMarks: { type: Number, required: true },
      obtainedMarks: { type: Number, required: true }
    }
  ],
  totalObtained: { type: Number },
  totalMarks: { type: Number },
  percentage: { type: Number },
  grade: { type: String },
  remarks: { type: String },
}, { timestamps: true });

resultSchema.pre("save", function (next) {
  this.totalObtained = this.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
  this.totalMarks = this.subjects.reduce((sum, s) => sum + s.totalMarks, 0);
  this.percentage = (this.totalObtained / this.totalMarks) * 100;

  if (this.percentage >= 80) this.grade = "A+";
  else if (this.percentage >= 70) this.grade = "A";
  else if (this.percentage >= 60) this.grade = "B";
  else if (this.percentage >= 50) this.grade = "C";
  else this.grade = "F";

  next();
});

export default mongoose.model("Result", resultSchema);
