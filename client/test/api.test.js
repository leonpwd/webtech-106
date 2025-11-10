const request = require('supertest');
const express = require('express');
const handles = require('../handles');

// Create a test app
const app = express();
app.use('/', handles);

// Default 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).type('text').send(
    'La page /hello vous dit bonjour, et vous pouvez personnaliser la réponse avec /hello?name=VotreNom. '
  );
});

describe('API Tests', () => {
  
  describe('GET /', () => {
    it('should return the home page with welcome message', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          if (!res.text.includes('Welcome!')) {
            throw new Error('Home page should contain "Welcome!"');
          }
        })
        .end(done);
    });
  });

  describe('GET /hello', () => {
    it('should return hello message for anonymous user', (done) => {
      request(app)
        .get('/hello')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          if (!res.text.includes('Welcome')) {
            throw new Error('Hello page should contain "Welcome"');
          }
        })
        .end(done);
    });

    it('should return personalized hello message with name parameter', (done) => {
      request(app)
        .get('/hello?name=John')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          if (!res.text.includes('Welcome, John')) {
            throw new Error('Hello page should contain personalized greeting');
          }
        })
        .end(done);
    });
  });

  describe('GET /about', () => {
    it('should return about page as JSON', (done) => {
      request(app)
        .get('/about')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });
  });

  describe('Articles API', () => {
    describe('GET /articles', () => {
      it('should return all articles', (done) => {
        request(app)
          .get('/articles')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            if (!Array.isArray(res.body)) {
              throw new Error('Response should be an array');
            }
            if (res.body.length === 0) {
              throw new Error('Should return at least one article');
            }
          })
          .end(done);
      });
    });

    describe('POST /articles', () => {
      it('should create a new article', (done) => {
        const newArticle = {
          title: 'Test Article',
          content: 'This is a test article content',
          date: '10/14/2025',
          author: 'Test Author'
        };

        request(app)
          .post('/articles')
          .send(newArticle)
          .expect(201)
          .expect('Content-Type', /json/)
          .expect((res) => {
            if (!res.body.id) {
              throw new Error('Created article should have an ID');
            }
            if (res.body.title !== newArticle.title) {
              throw new Error('Article title should match');
            }
            if (res.body.author !== newArticle.author) {
              throw new Error('Article author should match');
            }
          })
          .end(done);
      });

      it('should return 400 for invalid article data', (done) => {
        const invalidArticle = {
          title: 'Test Article'
          // Missing required fields
        };

        request(app)
          .post('/articles')
          .send(invalidArticle)
          .expect(400)
          .end(done);
      });
    });

    describe('GET /articles/:articleId', () => {
      it('should return a specific article', (done) => {
        // First get all articles to find a valid ID
        request(app)
          .get('/articles')
          .end((err, res) => {
            if (err) return done(err);
            
            const articles = res.body;
            if (articles.length === 0) return done(new Error('No articles found'));
            
            const articleId = articles[0].id;
            
            request(app)
              .get(`/articles/${articleId}`)
              .expect(200)
              .expect('Content-Type', /json/)
              .expect((res) => {
                if (res.body.id !== articleId) {
                  throw new Error('Article ID should match requested ID');
                }
              })
              .end(done);
          });
      });

      it('should return 404 for non-existent article', (done) => {
        request(app)
          .get('/articles/non-existent-id')
          .expect(404)
          .end(done);
      });
    });
  });

  describe('Comments API', () => {
    let testArticleId;

    before((done) => {
      // Get a valid article ID for testing comments
      request(app)
        .get('/articles')
        .end((err, res) => {
          if (err) return done(err);
          const articles = res.body;
          if (articles.length > 0) {
            testArticleId = articles[0].id;
          }
          done();
        });
    });

    describe('GET /articles/:articleId/comments', () => {
      it('should return comments for a specific article', (done) => {
        if (!testArticleId) return done(new Error('No test article ID available'));
        
        request(app)
          .get(`/articles/${testArticleId}/comments`)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            if (!Array.isArray(res.body)) {
              throw new Error('Response should be an array');
            }
          })
          .end(done);
      });
    });

    describe('POST /articles/:articleId/comments', () => {
      it('should create a new comment for an article', (done) => {
        if (!testArticleId) return done(new Error('No test article ID available'));
        
        const newComment = {
          content: 'This is a test comment',
          author: 'Test Commenter'
        };

        request(app)
          .post(`/articles/${testArticleId}/comments`)
          .send(newComment)
          .expect(201)
          .expect('Content-Type', /json/)
          .expect((res) => {
            if (!res.body.id) {
              throw new Error('Created comment should have an ID');
            }
            if (res.body.content !== newComment.content) {
              throw new Error('Comment content should match');
            }
            if (res.body.articleId !== testArticleId) {
              throw new Error('Comment should be associated with correct article');
            }
          })
          .end(done);
      });
    });

    describe('GET /articles/:articleId/comments/:commentId', () => {
      it('should return a specific comment', (done) => {
        if (!testArticleId) return done(new Error('No test article ID available'));
        
        // First get comments to find a valid comment ID
        request(app)
          .get(`/articles/${testArticleId}/comments`)
          .end((err, res) => {
            if (err) return done(err);
            
            const comments = res.body;
            if (comments.length === 0) {
              // Create a comment first
              const newComment = {
                content: 'Test comment for retrieval',
                author: 'Test Author'
              };
              
              request(app)
                .post(`/articles/${testArticleId}/comments`)
                .send(newComment)
                .end((err, createRes) => {
                  if (err) return done(err);
                  
                  const commentId = createRes.body.id;
                  
                  request(app)
                    .get(`/articles/${testArticleId}/comments/${commentId}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect((res) => {
                      if (res.body.id !== commentId) {
                        throw new Error('Comment ID should match requested ID');
                      }
                    })
                    .end(done);
                });
            } else {
              const commentId = comments[0].id;
              
              request(app)
                .get(`/articles/${testArticleId}/comments/${commentId}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if (res.body.id !== commentId) {
                    throw new Error('Comment ID should match requested ID');
                  }
                })
                .end(done);
            }
          });
      });

      it('should return 404 for non-existent comment', (done) => {
        if (!testArticleId) return done(new Error('No test article ID available'));
        
        request(app)
          .get(`/articles/${testArticleId}/comments/non-existent-comment-id`)
          .expect(404)
          .end(done);
      });
    });
  });
});