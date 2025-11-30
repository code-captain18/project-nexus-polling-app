# Getting Started with Vunes Poll

## Quick Start

### 1. Install Dependencies

Install root dependencies (optional, for running both servers together):
```bash
npm install
```

Install frontend dependencies:
```bash
npm run install:frontend
```

Install backend dependencies:
```bash
npm run install:backend
```

Or install all at once:
```bash
npm run install:all
```

### 2. Configure Environment Variables

#### Backend
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set your JWT secret:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

#### Frontend
```bash
cd frontend
cp .env.example .env
```

The default configuration points to `http://localhost:3000`. For mobile development, you may need to use your computer's IP address:
```env
API_URL=http://192.168.1.x:3000
```

### 3. Start the Backend

```bash
cd backend
npm run dev
```

The API server will start at `http://localhost:3000`

### 4. Start the Frontend

In a new terminal:
```bash
cd frontend
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

### 5. Or Run Both Together

From the root directory:
```bash
npm run dev
```

This will start both the backend and frontend servers concurrently.

## Testing the API

### Using the Backend Directly

Visit `http://localhost:3000` in your browser to see the API health check.

### Creating a Test User

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Signing In

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Getting Polls

```bash
curl http://localhost:3000/polls
```

## Mobile Development Tips

### Finding Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address (usually under en0 or wlan0).

### Update Frontend API URL

Update `frontend/app.config.js` or `frontend/.env`:
```env
API_URL=http://YOUR_IP_ADDRESS:3000
```

For example:
```env
API_URL=http://192.168.1.100:3000
```

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Verify all dependencies are installed: `cd backend && npm install`
- Check `.env` file exists with proper values

### Frontend can't connect to backend
- Verify backend is running at `http://localhost:3000`
- For mobile: Use your computer's IP address instead of localhost
- Check firewall isn't blocking port 3000
- Ensure both devices are on the same network (for mobile testing)

### Expo errors
- Clear Expo cache: `cd frontend && npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Next Steps

- Create an account in the app
- Create your first poll
- Vote on existing polls
- Check out the notifications
- Explore the profile page

Enjoy using Vunes Poll! 🎉
