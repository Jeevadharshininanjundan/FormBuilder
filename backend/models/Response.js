const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionIndex: Number,
  // answer shape depends on question type; keep flexible
  answer: Schema.Types.Mixed,
});

const ResponseSchema = new Schema(
  {
    formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [AnswerSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Response', ResponseSchema);