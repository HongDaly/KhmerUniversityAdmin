var UUID = require('uuid/v4');
var firebaseAdmin = require('../tools/firebase-admin-init').firebaseAdmin;
var database = firebaseAdmin.database();
var storage = firebaseAdmin.storage();
class ImageHelper {

    uploadImage(file, callForm, object) {
        let uuid = UUID();
        console.log(file.originalname);
        var imageBuffer = Buffer.from(file.buffer, 'base64');
        var bucket = storage.bucket();
        let fileName = `${callForm}/${new Date().getTime() + file.originalname}`;
        var uploadImage = bucket.file(fileName);
        uploadImage.save(imageBuffer, {
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: uuid
                }
            },
        }, function (error) {
            if (error) {
                console.log('Unable to upload the image.');
            } else {
                console.log('Uploaded');
                const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`
                    + encodeURIComponent(fileName)
                    + '?alt=media&token='
                    + uuid;
                console.log('URL', imgUrl);
                new ImageHelper().addImageUrlToDatabase(object, imgUrl, callForm)
            }
        });
    }
    addImageUrlToDatabase(object, imgUrl, callForm) {
        if (callForm == 'logo') {
            var imageRef = database.ref('university').child(object.id);
            imageRef.child('logo').set(imgUrl).then(function () {
                console.log("logo add");
            });
        } else if(callForm == 'university') {
            var imageRef = database.ref(`${callForm}`).child(object.id);
            imageRef.child('image').child(imageRef.push().key).set(imgUrl).then(function () {
                console.log("image add university");
            });
        }else if(callForm == 'faculty'){
            var imageRef = database.ref(`${callForm}`).child(object.university_id).child(object.id);
            imageRef.child('image').child(imageRef.push().key).set(imgUrl).then(function () {
                console.log("image add faculty");
            });
        }
    }
}
module.exports = { ImageHelper: ImageHelper }