
// Controllers
var UserController =  require('../controllers/UserController');
var RoomController = require('../controllers/RoomsController');
var MessagingController = require('../controllers/MessagingContoller');



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
router.get('/register', checkNotAuthenticated, (req,res) =>  UserController.register(req,res) );

router.get('/login', checkNotAuthenticated, (req,res) => UserController.login(req,res));

router.post('/register', checkNotAuthenticated, async (req,res) => UserController.register(req,res));

router.get('/search',checkAuthenticated , async (req,res) => UserController.search(req,res));



//Messaging routes
router.get('/chat/:roomId',checkAuthenticated,(req,res) =>   res.render() );


// Rooms routes
router.get('/room',checkAuthenticated, async (req,res) => RoomController.getRooms(req,res));

router.get('/room/:id',checkAuthenticated, async(req,res) => RoomController.getRoomById(req,res));

router.post('/room',checkAuthenticated, async (req,res) => RoomController.create(req,res));

router.post('/room/register',checkAuthenticated, async (req,res) => RoomController.register(req,res));


