const express = require('express');
const { default: mongoose, Schema, SchemaTypes } = require('mongoose');
const Director = require('../models/Director');
const router = express.Router();
const Movie = require('../models/Movie');

/* GET home page. */

router.get('/',(req,res)=>{
  const promise = Movie.aggregate([
    {
      $lookup : {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as : 'directors',
      }      
    },
    {
      $unwind : '$directors'
    }
  ]);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
})


router.get('/:start_year/:end_year',(req,res,next)=>{
  const {start_year, end_year} = req.params;

  const promise = Movie.find(
    {
      year : {"$gte": parseInt(start_year),"$lte":parseInt(end_year)}
    }
  );

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


router.get('/top10',(req,res,next)=>{

  const promise = Movie.find({}).sort({imdb_score : 1}).limit(10);

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
  const promise = Movie.findByIdAndUpdate(req.params.movieId,req.body);

  promise.then((data)=>{
    if(!data){
      next({message:"The movie was not found",code:404})
    }
    else{
      res.json(data);
    }
  }).catch((err)=>{
    res.json(err);
  })
})

router.delete('/:movieId',(req,res,next)=>{

  const promise = Movie.findByIdAndDelete(req.params.movieId);

  promise.then((data)=>{
    if(!data){
      next({message:"The movie was not found",code:404});
    }
    else{
      res.json({status:1})
    }
  }).catch((err)=>{
    res.json(err);
  })
})
router.post('/', (req,res)=>{

  const movie = new Movie(req.body);
  
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