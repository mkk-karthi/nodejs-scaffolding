# Node.js Scaffolding (Microservice Architecture)

A Node.js scaffolding project with **microservice architecture** supporting **User CRUD operations**.  
It uses **Sequelize ORM** for database management with migrations and seeders, along with modern tooling for security, logging, API documentation, and testing.

---

## 🚀 Features

- **CRUD Operations**: User management APIs  
- **Database**: Sequelize with migrations & seeders  
- **Security**: CORS & Helmet enabled  
- **Logging**: Winston with `winston-daily-rotate-file`  
- **API Documentation**: Swagger at [http://localhost:8888/api-docs/](http://localhost:8888/api-docs/)  
- **Testing**: Jest & Supertest with coverage reports  
- **Node Version**: Requires **Node.js >= 20.0.0**

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/mkk-karthi/nodejs-scaffolding.git
cd <project-folder>
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

* Copy the example environment files:

```bash
cp .env.example .env
cp .env.example .env.test
```

* Add your database credentials and other configs in `.env` and `.env.test`.

### 4. Configure Additional Properties

* Update `config.js` for custom properties.

### 5. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## 🗄️ Database Commands

```bash
# Run migrations
npm run db:migrate

# Refresh database (drop, migrate again)
npm run db:refresh

# Seed database
npm run db:seed
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Get coverage report
npm run test:coverage
```

---

## 📖 API Documentation

Swagger UI is available at:
👉 [http://localhost:8888/api-docs/](http://localhost:8888/api-docs/)

---

## 📜 Scripts Summary

| Script                  | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start in development mode         |
| `npm start`             | Start in production mode          |
| `npm run db:migrate`    | Run database migrations           |
| `npm run db:refresh`    | Refresh database (drop + migrate) |
| `npm run db:seed`       | Run seeders                       |
| `npm test`              | Run Jest unit tests               |
| `npm run test:coverage` | Generate Jest coverage report     |

---

## ✅ Requirements

* Node.js **20.0.0 or above**
* A configured database (MySQL/PostgreSQL/SQLite as per Sequelize setup)

---

## 🎉 Next Steps

Start the server and enjoy building your microservices!
