var User = require('../models/User');
const bcrypt = require('bcrypt');



class UserController {


    login(req, res) {
        res.render('Login');
    }


    logout(req, res) {
        req.logout();
        res.redirect('/api/user/login');
    }

    register(req, res) {
        res.render('Register')
    }

    async create(req, res) {
        try {
            const hashedpassword = await bcrypt.hash(req.body.password, 10);
            let user = new User();
            user.name = req.body.name;
            user.lastname = req.body.lastname;
            user.email = req.body.email;

            user.password = hashedpassword;
            console.log('user to create : ',user);
            user.save();
            res.redirect('/api/user/login');

        } catch (e) {
            res.redirect('/register');
        }
    }

    async search(req, res) {

        let currentUser = await req.user;

        let users = await User.find({ $and : [ 
            { 
                email: { 
                    '$regex': req.query.email, 
                    '$options': 'i' 
                }
            }, 
            {
             email: {
                $ne: currentUser.email
             }
            } 
        ]});
        res.send(users);
    }


}

module.exports = UserController;