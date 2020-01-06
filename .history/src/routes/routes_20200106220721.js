const router = require ('express').Router();
const passport = require ('passport')
const flash = require ('express-flash');
const Session = require ('express-session');
const methodOverride = require ('method-override');
const initializePassport = require('./passport-config');
const sharedsession = require("express-socket.io-session");
const User = require('../models/User');
const io = require ('socket.io')(9999);

//Passeport config
initializePassport(passport , (mail) => {
    return User.findOne({email: mail});
});

router.use(flash());
let session = Session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
})
router.use(session)
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));




// Controllers
var UserController =  require('../controllers/UserController');
var RoomController = require('../controllers/RoomsController');
var MessagingController  = require('../controllers/MessagingController');

io.use(sharedsession(session, {
    autoSave:true
}));
const userController =  new UserController();
const roomController =  new RoomController();
const messagingController = new MessagingController(io);

messagingController.connect();

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