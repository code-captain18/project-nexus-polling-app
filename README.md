# Vunes Poll

A full-stack polling application with React Native (Expo) frontend and Express backend deployed on Vercel.

## 🚀 Live Application

- **Backend API**: [https://project-nexus-backend.vercel.app](https://project-nexus-backend.vercel.app)
- **Database**: Vercel Postgres (Neon) - Serverless PostgreSQL
- **Frontend**: React Native app with Expo Go compatibility

## 📱 App Features

- **Cross-platform**: iOS, Android, and Web support
- **Real-time polling**: Create, vote, and view live results
- **User authentication**: JWT-based secure login/signup
- **Dark theme**: Unified dark header design with status bar integration
- **Push notifications**: Stay updated on poll activity
- **Charts & Analytics**: Visual poll results with bar and pie charts
- **Responsive design**: Professional UI with Tailwind CSS (NativeWind)
- **Live data**: Real-time updates and auto-refresh functionality

## 🏗️ Project Structure

```
vunes-poll/                    # Root directory (restructured from frontend/backend separation)
├── app/                       # Expo Router pages (file-based routing)
│   ├── _layout.tsx           # Root layout with tabs and navigation
│   ├── index.tsx             # Home screen (polls list)
│   ├── create.tsx            # Create new poll
│   ├── profile.tsx           # User profile and settings
│   ├── friends.tsx           # Friends management
│   ├── notifications.tsx     # Notifications center
│   ├── poll/[id].tsx         # Poll detail and voting
│   ├── signin.tsx            # Authentication
│   └── signup.tsx            # User registration
├── components/                # Reusable React components
│   ├── PageHeader.tsx        # Dark themed page headers
│   ├── PollCard.tsx          # Poll display cards
│   ├── VotingOption.tsx      # Poll voting interface
│   ├── ResultsBreakdown.tsx  # Vote results display
│   └── index.ts              # Component exports
├── store/                     # Redux state management
│   ├── slices/               # Redux slices
│   ├── thunks/               # Async actions
│   └── hooks.ts              # Custom Redux hooks
├── services/                  # API service layer
├── utils/                     # Utility functions and helpers
├── hooks/                     # Custom React hooks
├── config/                    # App configuration
├── assets/                    # Images, fonts, and static files
│   └── images/
│       ├── vunes-logo.png    # Custom app logo
│       └── ...
├── app.config.js             # Expo configuration
├── eas.json                  # EAS Build configuration
└── README.md                 # This documentation
```

## 🛠️ Tech Stack

### Frontend
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and build service
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management with RTK Query
- **NativeWind**: Tailwind CSS for React Native
- **Expo Router**: File-based navigation system
- **React Native Chart Kit**: Data visualization

### Backend (Deployed)
- **Node.js + Express**: RESTful API server
- **Vercel**: Serverless deployment platform
- **Vercel Postgres (Neon)**: Serverless PostgreSQL database
- **JWT**: Authentication and authorization
- **TypeScript**: Type-safe backend development

## 📖 Development Journey

### Phase 1: Foundation Setup ⚡
- **Initial Setup**: Created React Native app with Expo
- **Architecture**: Implemented Redux for state management
- **Routing**: Set up file-based routing with Expo Router
- **Styling**: Integrated Tailwind CSS with NativeWind

### Phase 2: Backend & Database 🗄️
- **API Development**: Built Express REST API with TypeScript
- **Authentication**: Implemented JWT-based auth system
- **Data Layer**: Started with in-memory storage, migrated to Vercel Postgres
- **Deployment**: Deployed backend to Vercel serverless platform

### Phase 3: Core Features 🎯
- **Polling System**: Create, edit, delete, and vote on polls
- **Real-time Updates**: Live vote counting and results
- **User Profiles**: Account management and user statistics
- **Notifications**: Poll activity notifications

### Phase 4: UI/UX Polish ✨
- **Design System**: Implemented consistent dark theme
- **Status Bar Integration**: Unified header and status bar appearance
- **Page Headers**: Created reusable PageHeader component
- **Visual Charts**: Added bar and pie chart visualizations
- **Custom Branding**: Integrated Vunes logo and custom splash screen

### Phase 5: Production Ready 🚀
- **EAS Configuration**: Set up Expo Application Services for builds
- **Environment Management**: Configured for development and production
- **Build Optimization**: Prepared for iOS and Android deployment
- **Database Migration**: Moved from in-memory to Vercel Postgres with auto-scaling

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli` (for building)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/code-captain18/project-nexus-polling-app.git
   cd project-nexus-polling-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start --go --clear
   ```

4. **Run on device**
   - **Android**: Download Expo Go from Play Store, scan QR code
   - **iOS**: Download Expo Go from App Store, scan QR code  
   - **Web**: Press `w` in terminal or open browser automatically

### Configuration

#### Environment Setup
The app is pre-configured to work with the deployed backend. No additional environment setup needed for development.

#### API Configuration
```typescript
// config/api.ts - Already configured
const API_BASE_URL = 'https://project-nexus-backend.vercel.app';
```



## 📱 Building for Production

### Android Build
```bash
# Preview build (APK for testing)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### iOS Build
```bash
# Requires Apple Developer account ($99/year)
eas build --platform ios --profile preview
```

### Deployment
```bash
# Submit to stores
eas submit --platform android  # Google Play
eas submit --platform ios      # App Store
```

## 🎨 Design System

### Color Palette
- **Primary**: `#2563EB` (Blue)
- **Secondary Dark**: `#1E293B` (Dark slate for headers)
- **Background**: `#F8FAFC` (Light gray)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Orange)  
- **Danger**: `#EF4444` (Red)

### Component Architecture
- **PageHeader**: Unified dark headers with status bar integration
- **PollCard**: Consistent poll display with voting stats
- **StatusBanner**: Poll status indicators (pending, active, ended)
- **VotingOption**: Interactive voting interface

## 🔧 Development Commands

## 🌐 API Integration

The app connects to a deployed Vercel backend with the following endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/me` - Get current user

### Polls
- `GET /polls` - Get all polls
- `GET /polls/:id` - Get specific poll
- `POST /polls` - Create new poll
- `POST /polls/:id/vote` - Submit vote
- `PUT /polls/:id` - Update poll
- `DELETE /polls/:id` - Delete poll

### Notifications
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark as read

## 🔍 Key Learnings

### Technical Challenges Solved
1. **Status Bar Integration**: Achieved seamless dark header design across iOS/Android
2. **State Management**: Implemented efficient Redux patterns with RTK Query
3. **Database Migration**: Successfully migrated from in-memory to Postgres
4. **Cross-Platform UI**: Consistent design using NativeWind/Tailwind
5. **Build Configuration**: Set up EAS for production deployments

### Development Insights
- **Expo Go vs Development Build**: Chose Expo Go for broader compatibility
- **Component Reusability**: Created modular, reusable UI components
- **Performance Optimization**: Implemented efficient data fetching and caching
- **User Experience**: Focus on intuitive navigation and responsive design

---

**Built by Prince Vuha**
