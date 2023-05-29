const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render("users/register");
}

module.exports.register = async(req,res)=>{
    try{
        const {email, username, lastname ,password} = req.body;
        const user = new User({email ,username, lastname});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to yelpcamp');
            res.redirect('/campgrounds/?page=1');
        })
        
    }catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/register');
    }  
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
}

module.exports.Login = (req , res)=>{
    req.flash('success','Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds/?page=1';
    console.log(req.header('Referer'))
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success',"GoodBYE");
        res.redirect('/campgrounds/?page=1');
    });
}