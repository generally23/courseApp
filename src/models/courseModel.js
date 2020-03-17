const {
    Schema,
    model
} = require( 'mongoose' );

const courseSchema = new Schema( {
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    poster: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
        //required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    requirements: {
        type: String,
        required: true
    },
    prerequisites: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    update_date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    published: {
        type: Boolean,
        default: false,
        required: true
    },
    length: {
        type: Number
    },
    objectives: {
        type: String,
        required: true
    }
} );


courseSchema.index( {
    name: 'text'
} )

const Course = model( 'Course', courseSchema );

module.exports = Course;


console.log( courseSchema.query )