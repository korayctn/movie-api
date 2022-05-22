const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

/* GET home page. */

router.get('/',(req,res)=>{
  const promise = Movie.find({ });

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
})
router.get('/:movieId',(req,res,next)=>{

    const promise = Movie.findById(req.params.movieId);

    promise.then((data)=>{
      if(!data){
        next({message:"The movie was not found",code:404});
      }
      else{
        res.json(data)
      }
    }).catch((err)=>{
      res.json(err);
    })
})

router.put('/:movieId',(req,res,next)=>{
  const promise = Movie.findByIdAndUpdate(req.params.movieId,req.body,{new:true});

  promise.then((data)=>{
    if(!data){
      next({message:"The movie was not found",code:404})
    }
    else{
      res.json({movieName:data.title,});
    }
  }).catch((err)=>{
    res.json(err);
  })
})
router.post('/', (req,res)=>{
  const {title,imdb_score,category,country,year} = req.body;

  const movie = new Movie({
    title:title,
    imdb_score:imdb_score,
    category:category,
    country:country,
    year:year
  })
  movie.save((err,data)=>{
    if(err){
      res.json(err)
    }
    else{
      res.json(data);
    }
  })
});



module.exports = router;