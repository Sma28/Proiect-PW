const {
    Users
} = require('../data');

const {
    generateToken,
} = require('../security/Jwt');

const {
    ServerError
} = require('../errors');

const {
    hash,
    compare
} = require('../security/Password');

const nodemailer = require('nodemailer');

const add = async (username, password, email) => {
    const hashedPassword = await hash(password);
    const role = username === 'sma'? 'admin' : 'user';
    const user = new Users({
        username,
        password: hashedPassword,
        role,
        confirmed : false,
        email
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'temapwsma@gmail.com',
          pass: 'temapw2020!'
        }
      });
      
      var mailOptions = {
        from: 'alex.sma280797@gmail.com',
        to: email,
        subject: 'Activation',
        text: 'Click on the url to activate your account http://localhost:3001/#/confirmAccount?email=' + email
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    
    await user.save();
};

const addSupport = async (username, password, email) => {
    const hashedPassword = await hash(password);
    const role = 'support';
    const user = new Users({
        username,
        password: hashedPassword,
        email,
        role,
        confirmed: false
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'temapwsma@gmail.com',
          pass: 'temapw2020!'
        }
      });
      
      var mailOptions = {
        from: 'alex.sma280797@gmail.com',
        to: email,
        subject: 'Activation',
        text: 'Click on the url to activate your account http://localhost:3001/#/confirmAccount?email=' + email
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    await user.save();
};

const getUserByEmail = async (email) => {
    return await Users.updateMany({email : email}, {confirmed : true});
};



const authenticate = async (username, password) => {

    const user = await Users.findOne({ username });
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
    }
    if (user.confirmed == false) {
        throw new ServerError(`Utilizatorul inregistrat cu username-ul \"${username}\" nu este activ!`, 404);
    }
    
    if (await compare(password, user.password)) {
        var token = await generateToken({
            userId: user._id,
            userRole: user.role
        });

        var userInfo = {
          username: user.username,
          email: user.email,
          role: user.role,
          token: token
        };
        return userInfo;
    } 
    throw new ServerError("Combinatia de username si parola nu este buna!", 404);
};

module.exports = {
    add,
    authenticate,
    addSupport,
    getUserByEmail
}