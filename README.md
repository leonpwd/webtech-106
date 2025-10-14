# Webtech Labs - Team 106

## Introduction
This repository contains lab exercises for the Web Technologies course (Fall 2025). The project is built with Node.js and Express.js, featuring a complete REST API with comprehensive testing.

### Test it out!
A hosted version is available at:
- [https://webtech.leobob.duckdns.org](https://webtech.leobob.duckdns.org)

## Project Structure
```
webtech-106/
├── .github/           # GitHub Actions workflows
├── server/            # Express.js server and API
│   ├── handles.js     # API route handlers
│   ├── index.js       # Express server
│   ├── content/       # Static content
│   └── test/          # Test suites
├── Dockerfile         # Docker configuration
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Features
- **Express.js REST API** with articles and comments endpoints
- **Comprehensive testing** with Mocha and SuperTest (16 tests)
- **Docker deployment** with multi-platform support
- **GitHub Actions CI/CD** pipeline
- **UUID-based** resource identification
- **Input validation** and error handling

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A modern web browser
- Git (for version control)

## Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/PingoLeon/webtech-106.git
cd webtech-106
npm install
```

## Usage

### Start the server
```bash
npm start
# Server runs at http://localhost:8082
```

### Development mode (with nodemon)
```bash
npm run dev
```

### Run tests
```bash
npm test
# Runs all 16 test cases
```

## API Endpoints

### Basic Routes
- `GET /` - Welcome page with API documentation
- `GET /hello` - Hello endpoint (supports `?name=` parameter)
- `GET /about` - About information (JSON)

### Articles API
- `GET /articles` - List all articles
- `POST /articles` - Create new article
- `GET /articles/:articleId` - Get specific article

### Comments API
- `GET /articles/:articleId/comments` - Get all comments for an article
- `POST /articles/:articleId/comments` - Add comment to an article
- `GET /articles/:articleId/comments/:commentId` - Get specific comment

### Example API Usage
```bash
# List all articles
curl http://localhost:8082/articles

# Create a new article
curl -X POST http://localhost:8082/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"New Article","content":"Content here","date":"10/14/2025","author":"Your Name"}'

# Get personalized greeting
curl http://localhost:8082/hello?name=Léon
```

## Docker Deployment
```bash
# Build and run with Docker
docker build -t webtech-106 .
docker run -p 8082:8082 webtech-106
```

## Testing
The project includes comprehensive test coverage:
- **API endpoint testing** (GET/POST operations)
- **Integration testing** (full workflows)
- **Error handling validation** (404s, validation errors)
- **16 test cases** covering all functionality

## Contribute
Contributions are welcome! Please fork the repository and submit a pull request.

## Authors
- Romain Barrière
- Léon Dalle


