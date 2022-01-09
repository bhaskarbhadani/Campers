const User=require('../models/user');

module.exports.index=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
        const user=new User({email,username});
        const reguser=await User.register(user,password);
        req.login(reguser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to the world of yelpcamp');
            res.redirect('/campgrounds');
        })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.loginpage=(req,res)=>{
    res.render('users/login');
}

module.exports.login=async(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl= req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logOut();
    req.flash('success','Goodbyee!!');
    res.redirect('/campgrounds');
}