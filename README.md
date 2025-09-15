# Webtech Labs - Team 106

## Introduction
This repository contains lab exercises for the Web Technologies course (Fall 2025). Each lab demonstrates a key web technology concept, and the project structure allows you to run and explore each lab independently.

### Test en ligne
A hosted version is available at :
- [https://webtech.leobob.duckdns.org](https://webtech.leobob.duckdns.org)
Check it out ! 


## Prerequisites
- Node.js (v22 or higher recommended)
- npm (Node Package Manager)
- A modern web browser (e.g., Brave, Firefox)
- Git (for version control)

## Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/PingoLeon/webtech-106.git
cd webtech-106
npm install
npm run install:labs
```

## Usage

### Start the landing page (index)
```bash
npm start
# Opens http://localhost:3000 with links to all labs
```

### Start all labs and landing page in parallel
```bash
npm run all
# Starts landing page and all labs (e.g., lab1 on 8081, lab2 on 8082)
```

### Start a specific lab
```bash
npm run lab1
# Starts lab1 on http://localhost:8081
```

#### Example: Try the /hello route in lab1
Visit: [http://localhost:8082/hello?name=YourName](http://localhost:8082/hello?name=YourName)

#### Example: Try the /about route in lab1
Visit: [http://localhost:8082/about](http://localhost:8082/about)

Each lab folder contains its own code and instructions if needed.

## Contribute
Contributions are welcome! Please fork the repository and submit a pull request.

## Authors
- Romain Barrière
- Léon Dalle


