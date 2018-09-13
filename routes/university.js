var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../tools/firebase-admin-init').firebaseAdmin;
var multer = require('../tools/firebase-admin-init').multer;
var database = firebaseAdmin.database();
var storage = firebaseAdmin.storage();
var university = require('../models/university');
var UUID = require('uuid/v4');
var getJSON = require('get-json');
var request = require("request")

router.get('/university', function (req, res) {
    var universityRef = database.ref('university');
    universityRef.once('value').then(function (snapshot) {
        res.render('layouts/university', {
            title: 'University',
            page: 'university',
            universitys: snapshot
        });
    });
})
router.post('/university', function (req, res) {
    res.redirect('/university');
})
router.get('/university-add', function (req, res) {
    var url="http://battuta.medunes.net/api/region/kh/all/?key=dccb82e7f0a798119726d081d956bcde";
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.render('layouts/university-add', {
                title: 'Add University',
                page: 'university',
                cities : body
            });
        }else{
            res.redirect('/university');
        }
    })
  
})
router.post('/university-add', multer.any(), function (req, res) {
    addUniversity(req, res);
})
router.post('', function (req, res) {
    res.redirect('/university-edit-:universityId');
})

function addUniversity(req, res) {
    var data = req.body;
    var universityRef = database.ref('university');
    university.id  =  universityRef.push().key;
    university.logo = "";
    university.name_en = data.name_en;
    university.name_kh = data.name_kh;
    university.name_abbreviation = data.name_abbreviation;
    university.description = data.description;
    university.contact.email = data.email;
    university.contact.website = data.website;
    university.contact.phone = data.phone;
    university.contact.address = data.address;
    university.contact.facebook_page = data.fb_page;
    university.geography.location_lat = data.location_lat;
    university.geography.location_long = data.location_long;
    university.geography.city = data.city;
    university.geography.library = data.library;
    university.geography.sport_facility = data.sport_facility;
    universityRef.child(university.id).set(university).then(function(){
        multipleImageCheck(req,university.id);
    });
    res.redirect('/university-add');
}
function multipleImageCheck(req,id){
    for(var i= 0;i<req.files.length;i++){
        if(req.files[i].fieldname == 'logo'){
            uploadImage(req.files[i],"logo",id);
        }
        else if(i!=1){
            uploadImage(req.files[i],"university",id);
        }
    }
}
function uploadImage(file, callForm,id) {
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
            addImageUrlToDatabase(id,imgUrl,callForm)
        }
    });
}
function addImageUrlToDatabase(id,imgUrl,callForm){
    if(callForm=='logo'){
        var imageRef = database.ref('university').child(id);
        imageRef.child('logo').set(imgUrl).then(function(){
            console.log("logo add");
        });
    }else{
        var imageRef = database.ref(`${callForm}`).child(id);
        imageRef.child('image').child(imageRef.push().key).set(imgUrl).then(function(){
            console.log("image add ");
        });
    }
}

module.exports = router


// router.get('/university/edit/:universityId',function(req,res){
//   var universityId = req.params.universityId;
//   var universityRef = database.ref('university');
//   universityRef.child(universityId).once('value').then(function(snapshot) {
//       if(snapshot.val()!=undefined){
//         res.render('layouts/university.edit.ejs',{
//             title : 'Edit University',
//             university : snapshot
//         });
//       }else{
//           res.redirect('/');
//       }
//   }); 
// })