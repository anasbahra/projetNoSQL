const router = require ('express').Router();
const passport = require ('passport')
const flash = require ('express-flash');
const session = require ('express-session');
const methodOverride = require ('method-override');



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


module.exports = router;