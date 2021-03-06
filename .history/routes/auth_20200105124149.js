const router = require ('express').Router();
const bcrypt = require ('bcrypt');
const passport = require ('passport')
const flash = require ('express-flash');
const session = require ('express-session');
const methodOverride = require ('method-override');
var User = require('../src/models/User');
var User = require('../src/models/Room');

const initializePassport = require ('./passport-config')

getUserByEmail = (mail) => {

    return User.findOne( {email: mail });
}
getUserByName = (name) => {

    return User.findOne( {name: name });
}


initializePassport(passport , getUserByEmail);
router.use(flash());
router.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));
var path = require('path');




router.get('/register', checkNotAuthenticated, (req,res) => {
    res.render(path.join(__dirname + '/../src/web/Register'));
});
router.get('/login', checkNotAuthenticated, (req,res) => {
    res.render(path.join(__dirname + '/../src/web/Login'));
});


router.get('/chat',checkAuthenticated,(req,res) => {
    res.render(path.join(__dirname + '/../src/web/messagerie'));
})
router.get('/', checkAuthenticated, async (req,res) => {

    let allUsers = await User.find();

    res.send(allUsers);
    res.render(path.join(__dirname + '/../src/web/index'));
});


router.get('/room',checkAuthenticated,(req,res) => {
    let rooms = 
});

router.post('/register', checkNotAuthenticated, async (req,res) => {
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
    

});

router.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/api/user/login',
    failureFlash: true

}));



router.delete('/logout',(req,res) => {
    req.logOut()
    res.redirect('/login')
})



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    }
    res.redirect('/api/user/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');

    }
    next();
}




module.exports = router;