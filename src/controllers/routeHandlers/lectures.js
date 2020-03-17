const captureAsyncError = require( '../../utils/captureAsyncErrors' );
const Lecture = require( '../../models/lectureModel' );
const Course = require( '../../models/courseModel' );
const ApplicationError = require( '../../utils/AppError' );

exports.fetchLectures = captureAsyncError( async ( req, res, next ) => {
    console.log( req.query )
    // find all lectures existing in the database
    const lectures = await Lecture.find( {
        section_id: req.params.sectionId
    } );
    // send back lelctures
    res.json( lectures );
} );

exports.createLecture = captureAsyncError( async ( req, res, next ) => {
    // get lecture name video sources and transcripts
    const {
        name,
        sources,
        transcripts
    } = req.body;
    // create a new lecture
    const lecture = new Lecture( {
        name,
        sources,
        transcripts,
        section_id: req.params.sectionId
    } );
    // save lecture to the database
    await lecture.save();
    // send created lecture
    res.status( 201 )
        .json( lecture );
} );

exports.fetchLecture = captureAsyncError( async ( req, res, next ) => {
    const lecture = await Lecture.findById( req.params.lectureId );
    if ( !lecture ) {
        return next( new AppError( 'The lecture you were looking for was not found', 404 ) )
    }
    res.json( lecture );
} );

exports.updateLecture = captureAsyncError( async ( req, res, next ) => {

    const course = Course.findById( req.params.courseId );
    // if ( !course ) return next( 'Course does not exist to update lecture for', 404 );

    if ( req.user.id.equals( course.author_id ) ) {
        return next( new ApplicationError( 'You cannot update a lecture you do not own', 403 ) )
    }

    const lecture = await Lecture.findById( req.params.lectureId );

    const allowed = [ 'sources', 'transcripts', 'name' ];

    const filtered = Object.keys( req.body )
        .filter( k => allowed.includes( k ) );
    filtered.forEach( k => lecture[ k ] = req.body[ k ] );
    res.json( lecture );
} );

exports.deleteLecture = captureAsyncError( async ( req, res, next ) => {

    const course = Course.findById( req.params.courseId );

    if ( !course ) return next( 'Course does not exist to update lecture for', 404 );

    if ( req.user.id.equals( course.author_id ) ) {
        return next( new ApplicationError( 'You cannot delete a lecture you do not own', 403 ) )
    }

    const lecture = await Lecture.findById( req.params.lectureId );

    if ( !lecture ) {
        return next( new AppError( 'The lecture you are trying to delete was not found', 404 ) );
    }
} )

exports.deleteLectures = captureAsyncError( async ( req, res, next ) => {

} )