const {
    Router
} = require( 'express' );

const router = Router( {
    mergeParams: true
} );

const {
    createLecture,
    fetchLectures,
    fetchLecture,
    updateLecture,
    deleteLecture,
    deleteLectures
} = require( '../../controllers/routeHandlers/lectures' );

router
    .route( '/' )
    .get( fetchLectures )
    .post( createLecture )
    .delete( deleteLectures )

router
    .route( '/:lectureId' )
    .get( fetchLecture )
    .patch( updateLecture )
    .delete( deleteLecture );

module.exports = router;