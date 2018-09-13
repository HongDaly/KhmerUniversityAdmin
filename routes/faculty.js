var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../tools/firebase-admin-init').firebaseAdmin;
var ImageHelper = require('../tools/image-helper').ImageHelper;
var database = firebaseAdmin.database();
var imageHelper = new ImageHelper();
var multer = require('../tools/firebase-admin-init').multer;
var faculty = require('../models/faculty');

router.get('/faculty',function(req,res){
    getAllFaculty(req,res);
})
router.post('/faculty',function(req,res){
    res.redirect('/faculty');
})
router.get('/faculty-add',function(req,res){
    getAllUniversity(req,res);
})
router.post('/faculty-add',multer.any(),function(req,res){
    addFaculty(req,res);
})
function getAllUniversity(req,res){
    var universityRef = database.ref('university');
    universityRef.once('value').then(function(snapshot) {
        res.render('layouts/faculty-add',{
            title : 'Faculty',
            universitys : snapshot,
            page : "faculty"
        });    
    });
}
function addFaculty(req,res){
    var data = req.body;
    var facultyRef = database.ref('faculty');
    faculty.university_id = data.university;
    faculty.id = facultyRef.push().key;
    faculty.name_en = data.name_en;
    faculty.name_kh = data.name_kh;
    faculty.contact.email = data.email;
    faculty.contact.facebook_page = data.fb_page;
    faculty.contact.phone = data.phone;
    faculty.contact.website = data.website;
    facultyRef.child(faculty.id).set(faculty).then(function(){
        multipleImageCheck(req,faculty);
    });
    res.redirect('/faculty-add');
}
function multipleImageCheck(req,object){
    for(var i= 0;i<req.files.length;i++){
        if(i!=0){
            imageHelper.uploadImage(req.files[i],"faculty",object);
        }
    }
}
function getAllFaculty(req,res){
    var facultyRef = database.ref('faculty').once('value').then(function(snapshot){
        var universityRef = database.ref('university')
        res.render('layouts/faculty',{
            title : 'Faculty',
            facultys : snapshot,
            page : "faculty"
        }); 
    })
}
module.exports = router