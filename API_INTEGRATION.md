# Vunes Poll - API Integration

## API Setup

The app is now configured to consume API endpoints from a backend server.

### Configuration

1. **API Base URL**: Set your backend URL in `app.config.js` or use environment variables
   - Default: `http://localhost:3000`
   - For production: Update in `app.config.js` or use `.env` file

2. **Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your API URL:
   ```
   API_URL=http://your-backend-url.com
   ```

### API Services

#### Auth Service (`services/authService.ts`)
- `signIn(email, password)` - User authentication
- `signUp(name, email, password)` - User registration
- `logout()` - User logout
- `getMe()` - Get current user
- `refreshToken()` - Refresh authentication token

#### Poll Service (`services/pollService.ts`)
- `getAllPolls()` - Fetch all polls
- `getPollById(id)` - Fetch single poll
- `createPoll(data)` - Create new poll
- `updatePoll(id, data)` - Update poll
- `deletePoll(id)` - Delete poll
- `vote(pollId, optionId)` - Vote on poll

#### User Service (`services/userService.ts`)
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `getMyPolls()` - Get user's polls
- `getMyVotes()` - Get user's votes

#### Notification Service (`services/notificationService.ts`)
- `getAllNotifications()` - Fetch all notifications
- `markAsRead(id)` - Mark notification as read
- `markAllAsRead()` - Mark all as read

### Redux Thunks

Async actions are available for all services:
- `signInAsync`, `signUpAsync`, `logoutAsync`
- `fetchPollsAsync`, `createPollAsync`, `votePollAsync`
- `fetchNotificationsAsync`, `markNotificationReadAsync`

### Usage Example

```typescript
import { useAppDispatch } from '../store/hooks';
import { signInAsync } from '../store/thunks/authThunks';

const dispatch = useAppDispatch();

const handleSignIn = async () => {
  const result = await dispatch(signInAsync({ email, password }));
  if (result.meta.requestStatus === 'fulfilled') {
    // Success
  }
};
```

### API Endpoints Structure

All endpoints are defined in `config/api.ts`:
- Auth: `/auth/signin`, `/auth/signup`, `/auth/logout`
- Polls: `/polls`, `/polls/:id`, `/polls/:id/vote`
- Users: `/users/profile`, `/users/polls`, `/users/votes`
- Notifications: `/notifications`

### Features

- ✅ Centralized API configuration
- ✅ Request/response interceptors
- ✅ Token management
- ✅ Error handling
- ✅ Request timeout (30s)
- ✅ TypeScript type safety
- ✅ Redux integration with async thunks
