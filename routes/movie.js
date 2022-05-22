const express = require('express');
const router = express.Router();
const MovieSchema = require('../models/Movie');

/* GET home page. */
router.post('/', (req,res)=>{
  const data = req.body.title;
  res.json(data);
});

module.exports = router;