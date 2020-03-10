const { Schema, model } = require('mongoose');

const lectureSchema = Schema({
  name: {},
  section_id: {},
  transcripts: [],
  sources: []
});

exports.Lecture = model('Lecture', lectureSchema);
