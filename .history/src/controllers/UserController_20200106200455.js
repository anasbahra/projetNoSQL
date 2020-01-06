var User = require('../src/models/User');
const bcrypt = require ('bcrypt');

var userController = ( function () {


 this.login = (req,res) => {
    res.render('Login');
 }


this.logout = (req,res) => {
    req.logout();
    req.redirect('/login');
} 

this.register = (req,res) => {
    res.render('Register')
}


this.create = async (req,res) => {
    try{
        const hashedpassword = await bcrypt.hash(req.body.password , 10);
        let user = new User();
        user.name = req.body.name;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        
        user.password = hashedpassword;
        user.save();
        res.redirect('/api/user/login');
    
    } catch(e){
        res.redirect('/register');
    }
}

this.search = async (req,res) => {

    let users =  await User.find({ email: {'$regex': req.query.email, '$options': 'i'} });
    res.send(users);
};



});

module.exports = userController;