const router = require ('express').Router();
const passport = require ('passport')
const flash = require ('express-flash');
const session = require ('express-session');
const methodOverride = require ('method-override');
const initializePassport = require('./passport-config');
var sharedsession = require("express-socket.io-session");
const User = require('../models/User');

//Passeport config
initializePassport(passport , (mail) => {
    return User.findOne({email: mail});
});

router.use(flash());
router.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));


// Controllers
var UserController =  require('../controllers/UserController');
var RoomController = require('../controllers/RoomsController');
var io  = require('../controllers/MessagingController');


const userController =  new UserController();
const roomController =  new RoomController();

console.log('UserController : ',userController)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    }
    res.redirect('/api/user/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/api/user/room');

    }
    next();

}

//auth Routes

router.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/api/user/room',
    failureRedirect: '/api/user/login',
    failureFlash: true

}));



router.delete('/logout',(req,res) => {
    req.logOut()
    res.redirect('/login')
})


// User routes
router.get('/register', checkNotAuthenticated, (req,res) =>  userController.register(req,res) );

router.get('/login', checkNotAuthenticated, (req,res) => userController.login(req,res));

router.post('/register', checkNotAuthenticated, async (req,res) => userController.register(req,res));

router.get('/search',checkAuthenticated , async (req,res) => userController.search(req,res));



//Messaging routes
router.get('/chat/:roomId',checkAuthenticated,(req,res) =>   res.render('messagerie',{ idRoom: req.params.roomId }) );


// Rooms routes
router.get('/room',checkAuthenticated, async (req,res) => roomController.getRooms(req,res));

router.get('/room/:id',checkAuthenticated, async(req,res) => roomController.getRoomById(req,res));

router.post('/room',checkAuthenticated, async (req,res) => roomController.createRoom(req,res));

router.post('/room/register',checkAuthenticated, async (req,res) => roomController.registerUser(req,res));




module.exports = router;