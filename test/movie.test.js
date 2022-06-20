const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

let token, movieId = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtvcmF5IiwiaWF0IjoxNjU0MzI4MzIyLCJleHAiOjE2NTQzMjkwNDJ9.3u7pzNGFBhN_LPBI_mrXgAvguAChLuY3fm3ZxY_RkBo';

describe('/api/movies tests', ()=>{

    before((done)=>{
        chai.request(server)
            .post('/authenticate')
            .send({username: 'koray',password: 'koray'})
            .end((err,res)=>{
                token = res.body.token;
                done();
            })
    })

    describe('GET movies',()=>{
        it('it should get all the movies',(done) =>{
            chai.request(server).get('/api/movies')
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
        })
    })

    describe('/POST movie',()=>{
        it('it should post a movie',(done)=>{
            const movie = {
                title:'Udemy',
                director_id: '628b5d6fb20ac2e614c199c3',
                country : 'Turkey',
                year : 2018,
                imdb_score : 8.2
            }

            chai.request(server)
            .post('/api/movies')
            .send(movie)
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('director_id');
                res.body.should.have.property('country');
                movieId = res.body._id;
                done();
            })
        })
    })
    describe('/GET api/movies/movie_id',()=>{
        it('it should return a movie from id',(done)=>{
            chai.request(server)
            .get('/api/movies/' + movieId)
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('director_id');
                res.body.should.have.property('country');
                res.body.should.have.property('_id').eql(movieId);
                done();
            })
        })
    })
    describe('/DELETE',()=>{
        it('it should delete the movie given by user',(done)=>{
            chai.request(server)
            .delete('/api/movies/'+ movieId)
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);
                done();
            })
        })
    })

    
})