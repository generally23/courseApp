const captureAsyncError = require( '../../utils/captureAsyncErrors' );

const Course = require( '../../models/courseModel' );

exports.fetchCourses = captureAsyncError( async ( req, res, next ) => {
    console.clear();
    const {
        name,
        limit
    } = req.query;
    const filterObj = {};
    if ( name ) filterObj.$text = {
        $search: name
    }

    const coursesQueryObject = Course.find( filterObj )

    coursesQueryObject.limit( parseInt( req.query.limit ) || 5 )
    const courses = await coursesQueryObject;
    res.json( courses );
} );

exports.createCourse = captureAsyncError( async ( req, res, next ) => {
    const {
        name,
        description,
        requirements,
        prerequisites,
        discount,
        objectives,
        length,
        price
    } = req.body;

    const newCourse = await Course.create( {
        name,
        description,
        requirements,
        prerequisites,
        discount,
        objectives,
        length,
        price
    } );

    res.status( 201 )
        .json( newCourse );
} );

exports.updateCourse = captureAsyncError( async ( req, res, next ) => {
    const course = Course.findById( req.params.courseId );
} );

exports.deleteCourse = captureAsyncError( async ( req, res, next ) => {
    const deletedCourse = await Course.findByIdAndDelete( req.params.courseId );
    console.log( deletedCourse );
    res.status( 204 )
        .json( {} );
} );


const mysql = require( 'mysql' );

const conn = mysql.createConnection( {
    host: 'Mysql@localhost:3306',
    user: 'root',
    password: 'generally23@mysql',
    database: 'world'
} )

conn.connect();


conn.query( 'SELECT * from country', function( error, results, fields ) {
    if ( error ) throw error;
    console.log( results );
    console.log( fields )
} );


conn.end();