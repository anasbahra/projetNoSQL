
// Controllers
var UserController =  require('../controllers/UserController');
var RoomController = require('../controllers/RoomsController');
var MessagingController = reauire('../controllers/MessagingContoller');

//routes
router.get('/register', checkNotAuthenticated, (req,res) =>  UserController.register(req,res) );

router.get('/login', checkNotAuthenticated, (req,res) => UserController.login(req,res));

router.post('/register', checkNotAuthenticated, async (req,res) => UserController.register(req,res));

router.get('/search',checkAuthenticated , async (req,res) => UserController.search(req,res));

router.get('/chat/:roomId',checkAuthenticated,(req,res) =>   res.render() );


router.get('/room',checkAuthenticated, async (req,res) => RoomController.getRooms(req,res));

router.get('/room/:id',checkAuthenticated, async(req,res) => RoomController.getRoomById(req,res));

router.post('/room',checkAuthenticated, async (req,res) => RoomController.create(req,res));

router.post('/room/register',checkAuthenticated, async (req,res) => RoomController.register(req,res));



router.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/api/user/room',
    failureRedirect: '/api/user/login',
    failureFlash: true

}));



router.delete('/logout',(req,res) => {
    req.logOut()
    res.redirect('/login')
})