var firebaseAdmin = require('firebase-admin');
var serviceAccount = require('../khuniversity-cef73-firebase-adminsdk-hjms2-4befc5a0b9.json');
var multerRoot = require('multer');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://khuniversity-cef73.firebaseio.com',
    storageBucket :'khuniversity-cef73.appspot.com'
});
var multer = multerRoot({
    storage: multerRoot.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024
    }
});
module.exports = {firebaseAdmin:firebaseAdmin,multer:multer}