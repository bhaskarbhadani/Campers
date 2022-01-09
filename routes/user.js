const express=require('express');
const router=express.Router();
const passport=require('passport');
const users=require('../controllers/users');
const catchAsync=require('../utils/catchAsync');

router.route('/register')
    .get(users.index)
    .post(catchAsync(users.register));
    
router.route('/login')
    .get(users.loginpage)
    .post(
       passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),
       catchAsync(users.login));

router.get('/logout',users.logout);

module.exports=router;