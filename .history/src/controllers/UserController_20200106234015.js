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
            user.save();
            res.redirect('/api/user/login');

        } catch (e) {
            res.redirect('/register');
        }
    }

    async search(req, res) {

        let users = await User.find({ email: { '$regex': req.query.email, '$options': 'i' } });
        res.send(users);
    }


}

module.exports = UserController;