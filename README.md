# TrekBuddy — Mobile Tourism Guide App

**An AI-Powered Mobile Tourism Guide Application for Puducherry (Pondicherry), India**

Built with React Native + Expo, Firebase, and Groq AI.

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Expo Go App** (for testing on physical device)
   - **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

4. **Android Studio** (for Android emulator — optional)

5. **Xcode** (for iOS simulator — macOS only — optional)

---

## ⚙️ Environment Setup

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys in `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY="your-firebase-key"
   EXPO_PUBLIC_GROQ_API_KEY="your-groq-key"
   ```

   - **Firebase key**: [Firebase Console](https://console.firebase.google.com) → Project Settings → Your Apps
   - **Groq key**: [Groq Console](https://console.groq.com) → API Keys

---

## 🚀 Installation & Running

### 1. Navigate to Project Directory

```bash
cd d:\TrekBuddymobileapp
```

### 2. Install Dependencies

```bash
npm install
```

> If you encounter peer-dependency errors:
> ```bash
> npm install --legacy-peer-deps
> ```

### 3. Start the Development Server

```bash
npm start
```

This starts the Metro bundler and shows a QR code in the terminal.

### Run on Specific Platform

| Platform | Command |
|---|---|
| Android emulator | `npm run android` |
| iOS simulator (macOS) | `npm run ios` |
| Web browser | `npm run web` |
| Tunnel (for firewall/VPN issues) | `npm run start:tunnel` |

### Scan QR Code (Physical Device)

1. Open **Expo Go** on your phone
2. Scan the QR code shown in the terminal

---

## 📁 Project Structure

```
TrekBuddymobileapp/
├── assets/              # Images, icons, logos
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context providers (Auth, Theme, Language)
│   ├── data/            # Local JSON and TypeScript data files
│   ├── firebase/        # Firebase configuration & auth helpers
│   ├── hooks/           # Custom React hooks (animations)
│   ├── navigation/      # Stack + Tab navigator setup
│   ├── screens/         # 36 screen components
│   ├── services/        # AI Planner, Image Search, Transit services
│   ├── theme/           # Colors, typography, spacing, shadows
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Firestore helpers, storage, auth utils
├── trekbuddy/           # Website scaffold (Expo Router — in progress)
├── App.tsx              # Root component
├── index.ts             # Entry point
├── app.json             # Expo configuration
├── eas.json             # EAS build configuration
├── .env.example         # Environment variable template
└── package.json         # Dependencies
```

---

## 🤖 AI Features

TrekBuddy uses the **Groq API** (`llama-3.3-70b-versatile`) for:
- **AI Trip Planner** — Generates day-by-day itineraries based on your preferences
- **AI Chatbot (Pondy AI)** — Answers questions about Puducherry: beaches, food, temples, transport, etc.

Both features require a valid `EXPO_PUBLIC_GROQ_API_KEY` in your `.env` file.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Language | TypeScript (strict) |
| Navigation | React Navigation v7 |
| Backend | Firebase (Firestore, Auth, Storage) |
| AI | Groq API (llama-3.3-70b) |
| Animations | React Native Reanimated v4 |
| Icons | @expo/vector-icons |
| Build | EAS (Expo Application Services) |

---

## 🏗️ Building for Production (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build Android APK
eas build --platform android --profile preview

# Build iOS IPA (macOS + Apple Dev account required)
eas build --platform ios --profile preview
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| Metro not starting | `expo start -c` (clear cache) |
| Dependencies failing | `npm install --legacy-peer-deps` |
| Port in use | `expo start --port 8082` |
| Expo Go not connecting | Use tunnel: `npm run start:tunnel` |
| "Invalid Groq API key" | Check `.env` has correct `EXPO_PUBLIC_GROQ_API_KEY` |

---

## 📖 Documentation

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Groq API](https://console.groq.com/docs)
- [Firebase](https://firebase.google.com/docs)

---

**TrekBuddy v1.0.0 | Puducherry, India 🏖️**
