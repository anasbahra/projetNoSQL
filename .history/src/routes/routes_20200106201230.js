const router = require ('express').Router();
const passport = require ('passport')
const flash = require ('express-flash');
const session = require ('express-session');
const methodOverride = require ('method-override');
const initializePassport = require('./passport-config');
const User = require('../models/User');

// Controllers
var UserController =  require('../controllers/UserController');
var RoomController = require('../controllers/RoomsController');
var MessagingController = require('../controllers/MessagingController');


const userController = UserController();
const roomController = RoomController();

console.log('UserController : ',UserController)

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
router.get('/chat/:roomId',checkAuthenticated,(req,res) =>   res.render() );


// Rooms routes
router.get('/room',checkAuthenticated, async (req,res) => roomController.getRooms(req,res));

router.get('/room/:id',checkAuthenticated, async(req,res) => roomController.getRoomById(req,res));

router.post('/room',checkAuthenticated, async (req,res) => roomController.create(req,res));

router.post('/room/register',checkAuthenticated, async (req,res) => roomController.register(req,res));


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

module.exports = router;