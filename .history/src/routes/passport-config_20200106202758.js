const localStrategy = require ('passport-local').Strategy;
const bcrypt = require ('bcrypt');
const User = require('../models/User');




function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
     const user = await getUserByEmail(email);
       console.log('user: ',user); 
        if (user == null){
            return done(null, false, { message: 'No user with that email'})
        }
        try{
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, { message: 'Passeword incorrect'})
            }

        }catch(e){
            return done (e);

        }

    }
    passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done (null , user.email));
    passport.deserializeUser((email, done) => {
        return done (null,(email) => User.findOne({email : email}));
    })
}

module.exports = initialize;