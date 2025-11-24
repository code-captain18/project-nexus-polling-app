# Vunes Poll Backend API

REST API for the Vunes Poll application built with Express and TypeScript.

## Features

- ✅ User authentication (signup, signin, JWT tokens)
- ✅ Poll CRUD operations
- ✅ Voting system
- ✅ User profiles
- ✅ Notifications
- ✅ CORS enabled
- ✅ In-memory data store (easy to swap with database)

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Production

Build and run:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/logout` - Logout user (requires auth)
- `GET /auth/me` - Get current user (requires auth)
- `POST /auth/refresh` - Refresh token (requires auth)

### Polls

- `GET /polls` - Get all polls
- `GET /polls/:id` - Get poll by ID
- `POST /polls` - Create poll (requires auth)
- `PUT /polls/:id` - Update poll (requires auth)
- `DELETE /polls/:id` - Delete poll (requires auth)
- `POST /polls/:id/vote` - Vote on poll (requires auth)

### Users

- `GET /users/profile` - Get user profile (requires auth)
- `PUT /users/profile` - Update profile (requires auth)
- `GET /users/polls` - Get user's polls (requires auth)
- `GET /users/votes` - Get user's votes (requires auth)

### Notifications

- `GET /notifications` - Get all notifications (requires auth)
- `PATCH /notifications/:id/read` - Mark as read (requires auth)
- `POST /notifications/read-all` - Mark all as read (requires auth)

## Request/Response Examples

### Sign Up

**Request:**
```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  }
}
```

### Create Poll

**Request:**
```json
POST /polls
Authorization: Bearer <token>
{
  "question": "What's your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question": "What's your favorite color?",
    "options": [
      { "id": "uuid", "text": "Red", "votes": 0 },
      { "id": "uuid", "text": "Blue", "votes": 0 },
      { "id": "uuid", "text": "Green", "votes": 0 },
      { "id": "uuid", "text": "Yellow", "votes": 0 }
    ],
    "totalVotes": 0,
    "createdBy": "user-id",
    "createdAt": "2024-11-21T00:00:00.000Z"
  }
}
```

### Vote

**Request:**
```json
POST /polls/:id/vote
Authorization: Bearer <token>
{
  "optionId": "option-uuid"
}
```

## Data Store

Currently using in-memory storage. To add a database:

1. Install database driver (e.g., `mongodb`, `pg`, `mysql2`)
2. Update `src/data/store.ts` to use database
3. Add connection logic in `src/index.ts`

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **CORS:** cors

## License

ISC
