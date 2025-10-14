const request = require('supertest');
const express = require('express');
const handles = require('../handles');

// Create a test app
const app = express();
app.use('/', handles);

describe('Integration Tests', () => {
  let createdArticleId;
  let createdCommentId;

  describe('Full API workflow', () => {
    it('should create an article, add comments, and retrieve them', (done) => {
      // Step 1: Create a new article
      const newArticle = {
        title: 'Integration Test Article',
        content: 'This article is for integration testing',
        date: '10/14/2025',
        author: 'Integration Tester'
      };

      request(app)
        .post('/articles')
        .send(newArticle)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          
          createdArticleId = res.body.id;
          
          // Step 2: Add a comment to the article
          const newComment = {
            content: 'This is an integration test comment',
            author: 'Comment Tester'
          };

          request(app)
            .post(`/articles/${createdArticleId}/comments`)
            .send(newComment)
            .expect(201)
            .end((err, res) => {
              if (err) return done(err);
              
              createdCommentId = res.body.id;
              
              // Step 3: Retrieve the article with its comments
              request(app)
                .get(`/articles/${createdArticleId}/comments`)
                .expect(200)
                .expect((res) => {
                  const comments = res.body;
                  const foundComment = comments.find(c => c.id === createdCommentId);
                  if (!foundComment) {
                    throw new Error('Created comment should be found in comments list');
                  }
                  if (foundComment.content !== newComment.content) {
                    throw new Error('Comment content should match');
                  }
                })
                .end(done);
            });
        });
    });

    it('should handle multiple articles and comments correctly', (done) => {
      const articles = [
        {
          title: 'Article 1',
          content: 'Content 1',
          date: '10/14/2025',
          author: 'Author 1'
        },
        {
          title: 'Article 2',
          content: 'Content 2',
          date: '10/14/2025',
          author: 'Author 2'
        }
      ];

      let articlesCreated = 0;
      const articleIds = [];

      // Create multiple articles
      articles.forEach((article, index) => {
        request(app)
          .post('/articles')
          .send(article)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            
            articleIds.push(res.body.id);
            articlesCreated++;
            
            if (articlesCreated === articles.length) {
              // All articles created, now add comments to each
              let commentsCreated = 0;
              
              articleIds.forEach((articleId, index) => {
                const comment = {
                  content: `Comment for article ${index + 1}`,
                  author: `Commenter ${index + 1}`
                };
                
                request(app)
                  .post(`/articles/${articleId}/comments`)
                  .send(comment)
                  .expect(201)
                  .end((err, res) => {
                    if (err) return done(err);
                    
                    commentsCreated++;
                    
                    if (commentsCreated === articleIds.length) {
                      // Verify each article has its comment
                      let verificationsComplete = 0;
                      
                      articleIds.forEach((articleId, index) => {
                        request(app)
                          .get(`/articles/${articleId}/comments`)
                          .expect(200)
                          .end((err, res) => {
                            if (err) return done(err);
                            
                            const comments = res.body;
                            const expectedContent = `Comment for article ${index + 1}`;
                            const foundComment = comments.find(c => 
                              c.content === expectedContent && c.articleId === articleId
                            );
                            
                            if (!foundComment) {
                              return done(new Error(`Comment for article ${index + 1} not found`));
                            }
                            
                            verificationsComplete++;
                            
                            if (verificationsComplete === articleIds.length) {
                              done();
                            }
                          });
                      });
                    }
                  });
              });
            }
          });
      });
    });
  });

  describe('Error handling', () => {
    it('should handle cascading errors correctly', (done) => {
      // Try to add comment to non-existent article
      const comment = {
        content: 'This comment should fail',
        author: 'Error Tester'
      };

      request(app)
        .post('/articles/non-existent-id/comments')
        .send(comment)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          
          // Try to get comments for non-existent article (should still work, return empty array)
          request(app)
            .get('/articles/non-existent-id/comments')
            .expect(200)
            .expect((res) => {
              if (!Array.isArray(res.body)) {
                throw new Error('Should return empty array for non-existent article comments');
              }
              if (res.body.length !== 0) {
                throw new Error('Should return empty array for non-existent article');
              }
            })
            .end(done);
        });
    });
  });
});