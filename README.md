# 🛠️ SabiFix Mobile App

> **Empowering Citizens to Report Community Issues and Helping Local Councils Prioritize Solutions**

SabiFix is a civic engagement platform that connects citizens with their local government. Citizens can report infrastructure problems (like potholes, broken pipes, or malfunctioning street lights), while other community members can upvote issues they care about. This helps local councils identify and prioritize the most urgent problems affecting their communities.

---

## 📱 What is SabiFix?

SabiFix is a **mobile application** designed for Sierra Leone that makes it easy for everyday citizens to:

- 📸 **Report problems** in their community with photos and location
- 👍 **Upvote issues** that affect them to show support
- 📍 **View problems** on an interactive map
- 🔔 **Get updates** when issues are being fixed or resolved
- 🤝 **Hold councils accountable** through transparent tracking

---

## 🌐 Related Projects

SabiFix is part of a complete ecosystem with three main components:

| Project | Description | Repository |
|---------|-------------|------------|
| **📱 Mobile App** | Citizen-facing mobile application (this repo) | You are here! |
| **🏛️ Council Dashboard** | Web dashboard for government officials to manage and resolve issues | [v0-sabi-fix-council-dashboard](https://github.com/networksignal62-del/v0-sabi-fix-council-dashboard.git) |
| **🌍 Landing Page** | Public website explaining SabiFix and encouraging downloads | [SabiFix-mobile-app-landing](https://github.com/ojoedejen/SabiFix-mobile-app-landing.git) |

---

## ✨ Key Features

### For Citizens
- ✅ **Easy Reporting**: Take a photo, select a category, add a description, and submit
- ✅ **Community Voting**: Upvote issues that matter to you (one vote per issue)
- ✅ **Interactive Map**: See all reported issues in your area on a map
- ✅ **Real-time Updates**: Get notified when your reported issues are being addressed
- ✅ **Issue Tracking**: Follow the progress from "Reported" → "In Progress" → "Resolved"
- ✅ **Share Issues**: Share problems with friends and family to gain more support

### For Council Officers (via Dashboard)
- ✅ **Prioritized View**: See which issues have the most community support
- ✅ **Status Management**: Update issue status and add notes
- ✅ **Analytics**: Track resolution rates and community engagement
- ✅ **Proof of Work**: Upload photos showing completed fixes

---

## 🛠️ Technology Stack

This app is built with modern, reliable technologies:

- **Framework**: [Expo](https://expo.dev) (React Native) - Build native iOS and Android apps with one codebase
- **Language**: TypeScript - Type-safe JavaScript for fewer bugs
- **Navigation**: Expo Router - File-based routing system
- **Backend**: [Supabase](https://supabase.com) - Open-source Firebase alternative
  - Authentication (Google OAuth, Email/Password)
  - PostgreSQL Database
  - Real-time subscriptions
  - File storage for images
- **Maps**: React Native Maps - Interactive location-based features
- **UI Components**: Custom components with Lucide icons
- **State Management**: React hooks and Supabase real-time listeners

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have these installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Check if installed: Open terminal and type `node --version`

2. **npm** (comes with Node.js)
   - Check if installed: Type `npm --version` in terminal

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Check if installed: Type `git --version` in terminal

4. **Expo Go App** (on your phone - for testing)
   - iOS: Download from App Store
   - Android: Download from Google Play Store

5. **Code Editor** (recommended)
   - [Visual Studio Code](https://code.visualstudio.com/) - Free and popular

---

## 📥 Installation

Follow these steps **exactly** to set up the project on your computer:

### Step 1: Clone the Repository

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/Alhassanojoekoroma/Sabifix-Mobile-Native-mobile-app.git
cd Sabifix-Mobile-Native-mobile-app
```

### Step 2: Install Dependencies

This downloads all the code libraries the app needs:

```bash
npm install
```

⏱️ This might take 2-5 minutes depending on your internet speed.

### Step 3: Set Up Environment Variables

You need to configure the app to connect to the backend (Supabase):

1. Create a file named `.env` in the root folder
2. Add the following content (replace with your actual Supabase credentials):

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_oauth_client_id
```

> **Where to get these values:**
> - Go to your [Supabase Dashboard](https://app.supabase.com/)
> - Select your project
> - Go to Settings → API
> - Copy the `Project URL` and `anon/public` key

### Step 4: Run the App

Start the development server:

```bash
npm start
```

You should see a QR code in your terminal. 

### Step 5: Open on Your Phone

1. Open the **Expo Go** app on your phone
2. **iOS**: Scan the QR code with your camera
3. **Android**: Scan the QR code with the Expo Go app
4. The app will load on your phone!

---

## 📱 Running on Emulators/Simulators

### Android Emulator

```bash
npm run android
```

> **Note**: Requires Android Studio with an emulator set up

### iOS Simulator (Mac only)

```bash
npm run ios
```

> **Note**: Requires Xcode installed

### Web Browser

```bash
npm run web
```

> **Note**: Some features (like camera and GPS) won't work in the browser

---

## 📂 Project Structure

Here's what each folder contains:

```
sabifix-app/
├── app/                    # Main application screens
│   ├── (tabs)/            # Bottom tab navigation screens
│   │   ├── index.tsx      # Home screen (map view)
│   │   ├── report.tsx     # Report issue screen
│   │   ├── profile.tsx    # User profile screen
│   │   └── _layout.tsx    # Tab navigation layout
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── signup.tsx     # Sign up screen
│   ├── onboarding.tsx     # First-time user onboarding
│   └── _layout.tsx        # Root layout
│
├── components/            # Reusable UI components
│   ├── IssueCard.tsx      # Issue display card
│   ├── IssueMap.tsx       # Interactive map component
│   ├── CustomTabBar.tsx   # Custom bottom navigation
│   └── ...                # Other components
│
├── lib/                   # Utility functions and configurations
│   ├── supabase.ts        # Supabase client setup
│   ├── google-ai.ts       # AI integration for image analysis
│   └── duplicate-detector.ts # Prevent duplicate reports
│
├── migrations/            # Database schema and updates
│   ├── 001_sponsorship_feature.sql
│   ├── 002_notifications_table.sql
│   └── ...
│
├── assets/                # Images, fonts, and static files
├── constants/             # App-wide constants and theme
├── package.json           # Project dependencies
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file!
```

---

## 🎨 Design System

SabiFix uses a consistent design language:

### Colors
- **Primary Blue**: `#312EFF` - Main brand color
- **Highlight Yellow**: `#FFFA8E` - Attention-grabbing accents
- **Accent Orange**: `#FFB229` - Warnings and high-priority items
- **Success Green**: `#00B894` - Completed/resolved states
- **Light Gray**: `#F4F7F9` - Backgrounds

### Typography
- **Font Family**: Inter (clean, modern, readable)
- **Sizes**: 
  - Titles: 20-28px (Bold)
  - Subtitles: 16-18px (Semi-bold)
  - Body: 13-15px (Regular)
  - Captions: 12px

---

## 🗄️ Database Schema

The app uses Supabase (PostgreSQL) with these main tables:

### `profiles`
User information and settings
- `id`, `email`, `full_name`, `avatar_url`, `phone`, `role`

### `issues`
Reported community problems
- `id`, `title`, `description`, `category`, `status`, `location`, `image_url`, `upvote_count`, `reporter_id`

### `upvotes`
Tracks which users upvoted which issues
- `issue_id`, `user_id`

### `notifications`
User notifications for issue updates
- `id`, `user_id`, `issue_id`, `message`, `read`, `created_at`

---

## 🔐 Authentication

SabiFix supports multiple authentication methods:

1. **Google OAuth** - Sign in with Google account
2. **Email/Password** - Traditional email registration
3. **Phone Number** - SMS-based authentication (future)

All authentication is handled securely through Supabase Auth.

---

## 🌍 Key Features Explained

### 1. Issue Reporting
Users can report problems by:
1. Taking or uploading a photo
2. Selecting a category (Roads, Water, Electricity, Waste, etc.)
3. Adding a description
4. Confirming GPS location (or manually adjusting)
5. Submitting to the database

**AI Enhancement**: The app uses Google AI to analyze images and auto-generate descriptions!

### 2. Upvoting System
- Each user can upvote an issue **once**
- Upvotes are tracked in the database
- Issues with more upvotes appear higher in priority lists
- Councils see which issues the community cares about most

### 3. Interactive Map
- Shows all reported issues as markers
- Color-coded by priority/status
- Tap markers to see issue details
- Filter by category or status
- Real-time updates when new issues are reported

### 4. Notifications
Users receive push notifications when:
- Their reported issue status changes
- An issue they upvoted gets updated
- High-priority issues are reported nearby

### 5. Duplicate Detection
The app automatically detects if you're reporting an issue that's already been reported nearby, preventing duplicates.

---

## 🧪 Testing

### Run Linter
Check code quality and catch errors:

```bash
npm run lint
```

### Manual Testing Checklist
- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] Report a new issue with photo
- [ ] Upvote an existing issue
- [ ] View issues on map
- [ ] Filter issues by category
- [ ] Receive notifications
- [ ] Update profile information

---

## 🚀 Deployment

### Build for Production

#### Android (APK/AAB)
```bash
eas build --platform android
```

#### iOS (IPA)
```bash
eas build --platform ios
```

> **Note**: Requires [Expo Application Services (EAS)](https://expo.dev/eas) account

### Publish Updates
Push over-the-air updates without app store approval:

```bash
eas update --branch production
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Coding Standards
- Use TypeScript for type safety
- Follow existing code style
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 Common Issues & Solutions

### Problem: "Metro bundler not starting"
**Solution**: 
```bash
npx expo start --clear
```

### Problem: "Module not found" errors
**Solution**: 
```bash
rm -rf node_modules
npm install
```

### Problem: "Supabase connection failed"
**Solution**: Check your `.env` file has correct credentials

### Problem: "App crashes on startup"
**Solution**: 
1. Clear Expo cache: `npx expo start --clear`
2. Restart Expo Go app
3. Check console for error messages

---

## 📚 Learn More

### Expo Documentation
- [Expo Docs](https://docs.expo.dev/) - Complete Expo documentation
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [Expo Go](https://expo.dev/go) - Testing on real devices

### Supabase Resources
- [Supabase Docs](https://supabase.com/docs) - Backend documentation
- [Supabase Auth](https://supabase.com/docs/guides/auth) - Authentication guide
- [Supabase Realtime](https://supabase.com/docs/guides/realtime) - Real-time features

### React Native
- [React Native Docs](https://reactnative.dev/) - Core framework
- [React Navigation](https://reactnavigation.org/) - Navigation patterns

---

## 👥 Team & Support

### Project Maintainers
- **Developer**: Alhassan Ojoe Koroma
- **Organization**: SabiFix Team

### Get Help
- 📧 **Email**: support@sabifix.com (if available)
- 💬 **Issues**: [GitHub Issues](https://github.com/Alhassanojoekoroma/Sabifix-Mobile-Native-mobile-app/issues)
- 📖 **Documentation**: This README and code comments

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ User authentication
- ✅ Issue reporting with photos
- ✅ Upvoting system
- ✅ Interactive map
- ✅ Real-time notifications
- ✅ AI-powered image analysis

### Planned Features (v2.0)
- 🔄 Offline mode for reporting
- 🔄 Multi-language support (Krio, English)
- 🔄 Voice-based reporting
- 🔄 Gamification and rewards
- 🔄 Comment threads on issues
- 🔄 Mobile money integration
- 🔄 Advanced analytics dashboard

---

## 🙏 Acknowledgments

Special thanks to:
- The citizens of Sierra Leone for inspiring this project
- Local councils for their partnership
- Expo and Supabase teams for excellent tools
- All contributors and testers

---

## 📞 Quick Start Summary

**For absolute beginners, here's the fastest way to get started:**

1. Install Node.js from https://nodejs.org/
2. Open terminal in this folder
3. Run: `npm install`
4. Run: `npm start`
5. Scan QR code with Expo Go app on your phone
6. Start exploring! 🎉

---

**Made with ❤️ for Sierra Leone**
