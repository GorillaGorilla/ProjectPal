/**
 * Created by GB115151 on 08/05/2016.
 */
var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');
var user, article;
agent = request.agent(app);

describe('Articles Controller Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        agent.post('/signup')
            .send(user)
            .end(function (err, res) {
                article = new Article({
                    title: 'Article Title',
                    content: 'Article Content',
                    user: user
                });

                agent.post('/api/articles')
                    .send(article)
                    .end(function(err, res){
                        done();
                    })

            });
    });
    describe('Testing the GET methods', function() {
        it('Should be able to get the list of articles', function(done){
            request(app).get('/api/articles/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.Array.and.have.lengthOf(1);
                    res.body[0].should.have.property('title', article.title);
                    res.body[0].should.have.property('content', article.content);
                    done();
                });
        });
        it('Should be able to get the specific article', function(done) {
            request(app).get('/api/articles/' + article.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.Object.and.have.property('title',article.title);
                    res.body.should.have.property('content', article.content);
                    done();
                });
        });
    });
    describe('Testing the Update method', function(){
        it('Should be able to update an article', function(done){
            agent.get('/api/articles/' + article.id)
                .end(function(err,res){
                    var updatedArticle = res.body;
                    updatedArticle.content = "new article content";
                    agent.put('/api/articles/' + article.id)
                        .send({title: updatedArticle.title, content: updatedArticle.content})
                        .set('Accept', 'application/json')
                        .expect('Content-Type',/json/)
                        .expect(200)
                        .end(function(err,res){
                            should.not.exist(err);
                            res.body.should.be.an.Object.and.have.property('title', updatedArticle.title);
                            res.body.should.have.property('content', updatedArticle.content);
                            done();
                        });
                });

        })
    });


    afterEach(function(done) {
        Article.remove().exec();
        User.remove().exec();
        request(app).get('/signout')
            .end(function(err, res) {
                if (err) console.log("logout error: " + err);
                done();
            });
    });
});