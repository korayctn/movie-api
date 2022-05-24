const express = require('express');
const router = express.Router();
const userSchema = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', async (req,res)=>{

  const password = await req.body.password;

  bcrypt.hash(password, 10,async function(err, hash) {

    const user = await new userSchema({

      username :  req.body.username,
      password :  hash,
    })

    const promise = user.save();

    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    })
});
})

router.post('/authenticate',(req,res)=>{
  const {username,password} = req.body;

  Users.findOne({
    username : username
  },(err,user)=>{
    if(err){
      throw err
    }
    else if (!user){
      res.json({status:'false',message:'the user couldn\'t be found'})
    }
    else{
      bcrypt.compare(password,user.password).then((result)=>{
        if(!result){
          res.json({status:'false',message:'the password is not correct.'})
        }
        else{
          const payload = {
            username : username
          }
          const token = jwt.sign(payload,req.app.get('api_secret_key'),{expiresIn:720});

          res.json({
            status:'true',
            token
          })
        }
      })
    }
  })
})
module.exports = router;
