const express=require('express');
const router=express.Router();
//const catchAsync=require('../utils/catchAsync');
const campgrounds=require('../controllers/campgrounds');
const {isLoggedIn,validateCampground,isauthor} =require('../middleware');
const multer=require('multer');
const  {storage}=require('../cloudinary');
const upload=multer({storage});


router.route('/')
   .get(campgrounds.index)
   .post(isLoggedIn,upload.array('image'),validateCampground,campgrounds.postNewForm);

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
   .get(campgrounds.showCampground)
   .put(isLoggedIn,isauthor,upload.array('image'),validateCampground,campgrounds.updateCampground)
   .delete(isLoggedIn,isauthor,campgrounds.deleteCampground);

router.get('/:id/edit',isLoggedIn,isauthor,campgrounds.editCampground);


module.exports=router;