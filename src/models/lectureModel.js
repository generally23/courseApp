const { Schema, model } = require('mongoose');

const lectureSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'A lecture must have a name'],
    },
    transcripts: [String],
    sources: {
      type: [String],
      required: [true, 'A lecture must have at least one video source'],
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'A lecture must be in a section'],
    },
  },
  { timestamps: true }
);

module.exports = lectureSchema;
