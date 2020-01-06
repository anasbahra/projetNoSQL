const router = require ('express').Router();
const bcrypt = require ('bcrypt');
const passport = require ('passport')
const flash = require ('express-flash');
const session = require ('express-session');
const methodOverride = require ('method-override');
var User = require('../src/models/User');
var Room = require('../src/models/Room');

const io = require ('socket.io')(9999);

const online = {};

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
    res.render('Register');
});
router.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('Login');
});


router.get('/chat/:roomId',checkAuthenticated,(req,res) => {

    if(isUserInRoom(req,req.params.roomId)) {
        io.on('connection', socket => {

       
            socket.join(roomId);
            socket.on('new-user', (avatar) => {
                online[socket.id] = avatar
                socket.to(roomId).emit('user-connected', avatar)
            });
            socket.on('send-chat-message', (message) => {
                console.log('message',message);
                socket.to(roomId).emit('chat-message', {message: message, avatar: online[socket.id]});
            });
        });
    res.render('messagerie',{layout: false});   
    }


    }
   
    
})
router.get('/', checkAuthenticated, async (req,res) => {

    let allUsers = await User.find();

    res.send(allUsers);
    res.render('index');
});


router.get('/search',async (req,res) => {

    let users =  await User.find({ email: {'$regex': req.query.email, '$options': 'i'} });
    res.send(users);
})

router.get('/room',checkAuthenticated, async (req,res) => {
  let user = await req.user;
  let roomList = await Room.find({ userOwner: user._id }).populate('broadcastingUserList');
  res.render('Room',{ rooms: roomList == null ? []: roomList  , user: user })

});

router.get('/room/:id',checkAuthenticated, async(req,res) =>{
    let room = await Room.findById(req.params.id).populate('broadcastingUserList');;
    res.send(room);
})

router.post('/room',checkAuthenticated, async (req,res) => {
    let room = new Room();
    let user = await req.user;

    room.name = req.body.name;
    room.userOwner = user._id;
    room.broadcastingUserList = [];
    room.save();
    res.redirect('/api/user/room');

});


router.post('/room/register',checkAuthenticated, async (req,res) => {

    let userMail = req.body.userMail;
    let roomId = req.body.roomId;
    
    let user =  await User.findOne({email : userMail});

    let room =  await Room.findById(roomId);
    console.log('selected' ,user);
    console.log('slected room',room);
    //register to room
    if(user !== undefined && room !== undefined) {
        let roomUpdated = await Room.update(
            { _id: roomId }, 
            { $push: { broadcastingUserList: user._id } }
        );
    }
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
    successRedirect: '/api/user/room',
    failureRedirect: '/api/user/login',
    failureFlash: true

}));



router.delete('/logout',(req,res) => {
    req.logOut()
    res.redirect('/login')
})



async function isUserInRoom(req , roomId){
    
    let user = await req.user;
    let room = Room.findOne({ $or: [{_id: roomId ,userOwner : user._id } , { _id: roomId, broadcastingUserList: user._id }]});

    if(room === undefined) { 
        return false;
    }
    else { 
        return true; 
    }

}

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




module.exports = router;