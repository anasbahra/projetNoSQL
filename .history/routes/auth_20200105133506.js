const router = require ('express').Router();
const bcrypt = require ('bcrypt');
const passport = require ('passport')
const flash = require ('express-flash');
const session = require ('express-session');
const methodOverride = require ('method-override');
var User = require('../src/models/User');
var Room = require('../src/models/Room');

const initializePassport = require ('./passport-config')

getUserByEmail = (mail) => {

    return User.findOne( {email: mail });
}
getUserByName =  (name) => {

    return  User.findOne( {name: name });
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


router.get('/search',async (req,res) => {

    let users =  await User.find({ mail: '/'+req.query.email+'/'});
    res.send(users);
})

router.get('/room',checkAuthenticated, async (req,res) => {
  let user = await req.user;
  console.log(user);
    let roomList = await Room.find({ userOwner: user._id });
    console.log('roomList',roomList);
    res.render(path.join(__dirname + '/../src/web/Room'),{ rooms: roomList == null ? []: roomList })

});

router.post('/room',checkAuthenticated, async (req,res) => {
    let room = new Room();
    let user = await req.user;

    room.name = req.body.name;
    room.userOwner = user._id;
    room.broadcastingUserList = [];
    room.save();
    res.redirect('/api/user/room');

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