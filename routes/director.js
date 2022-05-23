const express = require('express');
const Director = require('../models/Director');
const mongoose = require('mongoose');
const router = express.Router();

const directorSchema = require('../models/Director');
const Movie = require('../models/Movie');

router.post('/',(req,res)=>{

    const director = new Director(req.body);
    const promise = director.save();

    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })

})

router.get('/',(req,res)=>{
    Director.aggregate([
        {
            $lookup : {
                from : 'movies',
                localField: '_id',
                foreignField : 'director_id',
                as : 'movies'
            }
        },
        {
            $unwind : {
                path : '$movies',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $group : {
                _id:{
                    _id : '$id',
                    name: '$name',
                    surname: '$surname',
                    bio : '$bio',
                },
                movies: {
                    $push: '$movies'
                },
            }
        },
        {
            $project : {
                _id : '$_id.id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies : '$movies',
            }
        }
    
    ],(err,data)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json(data);
        }
    })

    
})
router.get('/:director_id',(req,res)=>{
    
    Director.aggregate([
        {
            $match:{
                '_id' : mongoose.Types.ObjectId(req.params.director_id),
            }
        },

        {
            $lookup : {
                from : 'movies',
                localField: '_id',
                foreignField : 'director_id',
                as : 'movies'
            }
        },
        {
            $unwind : {
                path : '$movies',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $group : {
                _id:{
                    _id : '$id',
                    name: '$name',
                    surname: '$surname',
                    bio : '$bio',
                },
                movies: {
                    $push: '$movies'
                },
            }
        },
        {
            $project : {
                _id : '$_id.id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies : '$movies',
            }
        }
    
    ],(err,data)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json(data);
        }
    })
})

router.put('/:director_id',(req,res)=>{
    const promise = Director.findByIdAndUpdate(req.params.director_id,req.body,{new:true});
    
    promise.then((data)=>{
        if(!data){
            next({message:'the director was not found', code : 404});
        }
        else{
            res.json(data);
        }
    }).catch((err)=>{
        res.json(err);
    })
})

router.delete('/:director_id',(req,res)=>{
    const promise = Director.findByIdAndRemove(req.params.director_id);

    promise.then((data)=>{
        if(!data){
            next({message:'the director was not found.',code: 404 });
        }
        else{
            res.json({status: 1,message:'the director was deleted.'});
        }
    }).catch((err)=>{
        res.json(err);
    })
})
module.exports = router;