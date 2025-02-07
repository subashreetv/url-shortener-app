# Custom URL Shortener API

## 📌 Overview
This is a **scalable URL Shortener API** built using **Node.js, Express, MongoDB, Redis, and Docker**. It provides advanced analytics, authentication via **Google Sign-In**, and rate limiting. The API allows users to shorten URLs, track clicks, and analyze usage based on topics.

## 🚀 Features
- Shorten long URLs with custom aliases
- Redirect users and log analytics
- Authentication with Google Sign-In
- Analytics tracking (clicks, unique users, OS, device type, etc.)
- Rate limiting for API requests
- API documentation via Swagger
- Dockerized for easy deployment

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Caching:** Redis
- **Authentication:** Google OAuth 2.0
- **Documentation:** Swagger
- **Deployment:** Docker

---

## 📂 Project Structure
```
url-shortener-api/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── index.js
│
├── config/
├── test/
├── docker-compose.yml
├── Dockerfile
├── swagger.json
├── package.json
├── README.md
```

---

## 🛠️ Setup & Installation

### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/url-shortener-api.git
cd url-shortener-api
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Setup Environment Variables**
Create a `.env` file and add:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **4. Start MongoDB & Redis Locally**
```sh
mongod --dbpath ./data
redis-server
```

### **5. Start the Server**
```sh
npm start
```
API will be available at `http://localhost:5000`

---

## 🐳 Running with Docker
### **Build & Run Containers**
```sh
docker-compose up --build
```

### **Stop Containers**
```sh
docker-compose down
```

---

## 🔑 Authentication
This API uses **Google Sign-In**. Users must authenticate and receive a **JWT token** for API access.

### **Get Access Token**
Send a `POST` request to `/apauth/google` returns a google signin url.Running that url in browser in turn will return jwt token.

---

## 📖 API Documentation (Swagger)
Available at: [http://localhost:5000/docs]

---

## ✅ Testing
### **Run Test Cases with Mocha & Chai**
```sh
npm test
```

### **Ensure a Clean Database Before Tests**
beforeEach(async () => {
  await mongoose.connection.db.collection('urls').deleteMany({});
});

---

🚀 **Enjoy Shortening URLs!**

