# Express Sequelize Boilerplate

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

This is a robust boilerplate for building REST APIs in Node.js using Express and Sequelize ORM. It provides a complete starting point for creating scalable web applications with authentication, file uploads, error handling, and more.

## Features

- 🔐 Authentication system with JWT
- 📦 Sequelize ORM for database operations
- 🔄 CRUD operations with a base repository pattern
- 📝 Validation using Yup
- 📤 File uploads with AWS S3 integration
- 🧩 Modular project structure
- 🚫 Error handling middleware
- 📊 Pagination support
- 📝 Logging with dedicated service

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL or PostgreSQL
- AWS account (for S3 file uploads)
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gadfaria/express-sequelize-boilerplate.git
```

2. Navigate to the project directory:

```bash
cd express-sequelize-boilerplate/
```

3. Install dependencies:

```bash
pnpm install
```

4. Set up environment variables:

```bash
cp .env.example .env
```

5. Edit the `.env` file with your configuration

6. Create database:

```bash
yarn sequelize db:create
# or
npx sequelize-cli db:create
```

7. Run migrations:

```bash
yarn sequelize db:migrate
# or
npx sequelize-cli db:migrate
```

8. Start the development server:

```bash
# or
pnpm dev
```

## Environment Configuration

| Variable | Description |
|----------|-------------|
| SERVER_PORT | Port the server will run on |
| NODE_ENV | development or production |
| SERVER_JWT | true or false (enable/disable JWT) |
| SERVER_JWT_SECRET | Secret key for JWT |
| SERVER_JWT_TIMEOUT | JWT expiration time |
| DB_DIALECT | Database type (mysql, postgres, etc.) |
| DB_HOST | Database host |
| DB_USER | Database username |
| DB_PASS | Database password |
| DB_NAME | Database name |
| AWS_KEYID | AWS access key ID |
| AWS_SECRETKEY | AWS secret access key |
| AWS_BUCKET | AWS S3 bucket name |

## API Structure

The API follows RESTful principles and uses the following structure:

- Authentication endpoints (`/login`, `/register`, `/me`)
- User management (`/user`)
- Various business logic endpoints

Please refer to the Postman collection included in the project for examples of available endpoints.

## Database Commands

```bash
# Create database
yarn sequelize db:create 

# Drop database
yarn sequelize db:drop 

# Run migrations
yarn sequelize db:migrate 

# Undo all migrations
yarn sequelize db:migrate:undo:all 

# Run seeders
yarn sequelize db:seed:all

# Create a new model
yarn sequelize model:generate --name User --attributes name:string,email:string

# Create a new migration
yarn sequelize migration:generate --name add-column-to-user
```

## Development Guide

For detailed information about the project structure, how to add new features, and development best practices, please refer to the [DEVELOPER.md](DEVELOPER.md) document.

## Testing

Coming soon

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [JWT](https://jwt.io/)

<h5 align="center">
  ☕ Code and Coffee
</h5>
