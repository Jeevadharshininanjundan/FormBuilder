const mongoose = require('mongoose');
const { Schema } = mongoose;

// Passage question schema for comprehension type
const passageQuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
}, { _id: false });

// Categorize question category schema
const categorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

// Categorize question option schema
const optionSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

// Question schema
const questionSchema = new Schema({
  type: { type: String, required: true, enum: ['categorize', 'cloze', 'comprehension'] },
  questionText: { type: String, default: '' },
  imageUrl: { type: String, default: '' },

  // For 'categorize' type
  categories: {
    type: [categorySchema],
    default: undefined,
    required: function () { return this.type === 'categorize'; }
  },
  options: {
    type: [Schema.Types.Mixed],  // mixed because for categorize it's array of objects; for cloze it's array of strings
    required: function () { return this.type === 'categorize' || this.type === 'cloze'; },
  },
  optionCategoryMap: {
    type: Map,
    of: String,
    required: function () { return this.type === 'categorize'; }
  },

  // For 'cloze' type
  clozeText: {
    type: String,
    default: '',
    required: function () { return this.type === 'cloze'; }
  },

  // For 'comprehension' type
  passage: {
    type: String,
    default: '',
    required: function () { return this.type === 'comprehension'; }
  },
  passageQuestions: {
    type: [passageQuestionSchema],
    default: undefined,
    required: function () { return this.type === 'comprehension'; }
  }
});

// Form schema
const formSchema = new Schema({
  title: { type: String, required: true },
  headerImage: { type: String, default: null },
  questions: [questionSchema],
});

module.exports = mongoose.model('Form', formSchema);
