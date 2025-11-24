# Vunes Poll

A full-stack polling application with React Native (Expo) frontend and Express backend.

## Project Structure

```
vunes-poll/
├── frontend/          # React Native Expo app
│   ├── app/          # Expo Router pages
│   ├── components/   # React components
│   ├── config/       # API configuration
│   ├── services/     # API services
│   ├── store/        # Redux store
│   └── assets/       # Images and fonts
│
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Auth middleware
│   │   ├── data/     # Data store
│   │   └── types.ts  # TypeScript types
│   └── dist/         # Compiled output
│
└── README.md         # This file
```

## Features

### Frontend
- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Tailwind CSS with NativeWind
- 🔄 Redux for state management
- 🧭 File-based routing with Expo Router
- 🔐 JWT authentication
- 📊 Real-time poll voting
- 🔔 Notifications
- 👤 User profiles

### Backend
- 🚀 RESTful API with Express
- 🔒 JWT authentication
- 📝 TypeScript
- 🗃️ In-memory data store (easily replaceable with database)
- ✅ CORS enabled
- 🔐 Password hashing with bcryptjs

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The Expo development server will start. You can:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web browser
- Scan QR code with Expo Go app

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API server will run at `http://localhost:3000`

### Environment Variables

#### Frontend (`frontend/.env`)
```env
API_URL=http://localhost:3000
```

#### Backend (`backend/.env`)
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register
- `POST /auth/signin` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Polls
- `GET /polls` - Get all polls
- `GET /polls/:id` - Get poll by ID
- `POST /polls` - Create poll (auth required)
- `PUT /polls/:id` - Update poll (auth required)
- `DELETE /polls/:id` - Delete poll (auth required)
- `POST /polls/:id/vote` - Vote (auth required)

### Users
- `GET /users/profile` - Get profile (auth required)
- `PUT /users/profile` - Update profile (auth required)
- `GET /users/polls` - Get user's polls (auth required)
- `GET /users/votes` - Get user's votes (auth required)

### Notifications
- `GET /notifications` - Get notifications (auth required)
- `PATCH /notifications/:id/read` - Mark as read (auth required)
- `POST /notifications/read-all` - Mark all as read (auth required)

## Development

### Frontend
```bash
cd frontend
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
```

### Backend
```bash
cd backend
npm run dev        # Development with hot reload
npm run build      # Build TypeScript
npm start          # Run production build
```

## Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- Redux Toolkit
- NativeWind (Tailwind CSS)
- Expo Router

### Backend
- Node.js
- Express
- TypeScript
- JWT
- bcryptjs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC
