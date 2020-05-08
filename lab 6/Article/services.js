const {
    Article
} = require('../data');

const nodemailer = require('nodemailer');

const add = async (username, userEmail, important, question, answer) => {
    const article = new Article({
        username,
        userEmail,
        important,
        question,
        answer
    });
    console.log(article);
    await article.save();
};

const getAll = async () => {
    return await Article.find();
};

const getById = async (id) => {
    return await Article.findById(id);
};

const updateById = async (id, answer, important, email, question) => {
  console.log('email: ' + email);
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
        subject: 'Dog Lovers Support',
        text: 'Dog Lovers support answer to you question:\n' + question + '\n'+ 'Answer:\n' + answer
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    await Article.findByIdAndUpdate(id, { answer, important });
};

const deleteById = async (id) => {
    await Article.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    getById,
    updateById,
    deleteById
}