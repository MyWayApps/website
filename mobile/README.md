# MyWayApps Mobile Application

A full-featured mobile application for MyWayApps - an educational platform for kids with games and learning activities in Math, Telugu, English, Life Skills, Games, and Puzzles.

## 📱 Features

- **Cross-platform**: Works on both iOS and Android
- **Educational Games**: Math, Telugu, English learning games
- **Life Skills**: Cooking recipes and practical skills
- **Games & Puzzles**: Memory games, shape puzzles, and more
- **Telugu Learning**: Interactive Gunintaalu (consonant combinations) learning
- **Offline Support**: Works without internet connection
- **Progress Tracking**: Save and track your learning progress

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **npm** or **yarn** (comes with Node.js)

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go App** (for testing on physical devices)
   - iOS: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: Download from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

5. **Development Tools** (Optional but recommended):
   - **iOS Simulator**: Requires Xcode (macOS only)
   - **Android Emulator**: Requires Android Studio

## 📦 Installation

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Install Expo CLI globally** (if not already installed):
   ```bash
   npm install -g expo-cli
   ```

## 🏃 Running the Application

### Option 1: Using Expo Go (Recommended for Quick Testing)

1. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. **Scan the QR code**:
   - **iOS**: Open the Camera app and scan the QR code, or use the Expo Go app
   - **Android**: Open the Expo Go app and scan the QR code, or use the built-in scanner

3. The app will load on your device through Expo Go

### Option 2: Using iOS Simulator (macOS only)

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Press `i`** in the terminal to open iOS Simulator

3. The app will launch in the iOS Simulator

### Option 3: Using Android Emulator

1. **Start your Android emulator** (from Android Studio)

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Press `a`** in the terminal to open Android Emulator

4. The app will launch in the Android Emulator

### Option 4: Direct Platform Commands

- **iOS**:
  ```bash
  npm run ios
   ```
   or
   ```bash
   expo start --ios
   ```

- **Android**:
  ```bash
   npm run android
   ```
   or
   ```bash
   expo start --android
   ```

- **Web** (for testing):
   ```bash
   npm run web
   ```
   or
   ```bash
   expo start --web
   ```

## 🧪 Testing the Application

### Testing on Physical Device

1. **Ensure your device and computer are on the same Wi-Fi network**

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open Expo Go app** on your device

4. **Scan the QR code** displayed in the terminal or browser

5. The app will load and you can test all features

### Testing on Emulator/Simulator

1. **iOS Simulator** (macOS only):
   - Requires Xcode to be installed
   - Run `npm start` and press `i`
   - Or use `npm run ios`

2. **Android Emulator**:
   - Requires Android Studio and an AVD (Android Virtual Device)
   - Start your emulator first
   - Run `npm start` and press `a`
   - Or use `npm run android`

### Testing Features

1. **Home Screen**:
   - Navigate through different categories
   - Tap on app cards to open games
   - Test the navigation menu

2. **Telugu Gunintaalu**:
   - Navigate to Telugu section
   - Select a consonant
   - Test Learn mode with audio playback
   - Try different game modes (Sequence, Missing Letters, Match the Pair)

3. **Games**:
   - Test various game screens
   - Verify navigation between screens
   - Check progress tracking

4. **Offline Mode**:
   - Turn off Wi-Fi/data
   - Verify app still works
   - Check that data persists

## 🛠️ Development

### Project Structure

```
mobile/
├── App.tsx                 # Main app entry point with navigation
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── TeluguGunintaaluScreen.tsx
│   │   ├── TeluguLearnScreen.tsx
│   │   └── TeluguGameScreen.tsx
│   ├── components/       # Reusable components
│   │   ├── AppCard.tsx
│   │   ├── CategorySection.tsx
│   │   └── NavigationMenu.tsx
│   ├── utils/            # Utility functions
│   │   ├── storage.ts
│   │   ├── colors.ts
│   │   └── telugu-tts.ts
│   ├── data/             # Static data
│   │   └── applications.ts
│   └── types/            # TypeScript types
│       └── index.ts
├── assets/               # Images, icons, etc.
├── package.json
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
└── babel.config.js       # Babel configuration
```

### Adding New Features

1. **New Screen**:
   - Create a new file in `src/screens/`
   - Add route to `App.tsx` navigation stack
   - Update types in `App.tsx` if needed

2. **New Component**:
   - Create a new file in `src/components/`
   - Export and use in screens

3. **New Utility**:
   - Add to `src/utils/`
   - Import where needed

## 📱 Building for Production

### Building APK (Android)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure build**:
   ```bash
   eas build:configure
   ```

4. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

### Building IPA (iOS)

1. **Follow steps 1-3 above**

2. **Build IPA**:
   ```bash
   eas build --platform ios --profile preview
   ```

### Local Builds (Advanced)

For local builds, you'll need to:
- Set up native development environment
- Use `expo run:android` or `expo run:ios`
- Requires Android Studio (Android) or Xcode (iOS)

## 🐛 Troubleshooting

### Common Issues

1. **"Unable to resolve module" errors**:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Metro bundler cache issues**:
   ```bash
   npm start -- --reset-cache
   ```

3. **Expo Go connection issues**:
   - Ensure device and computer are on same network
   - Try using tunnel mode: `expo start --tunnel`

4. **iOS Simulator not opening**:
   - Ensure Xcode is installed
   - Run `xcode-select --install` if needed

5. **Android Emulator not found**:
   - Ensure Android Studio is installed
   - Create an AVD in Android Studio
   - Ensure `ANDROID_HOME` is set

### Clearing Cache

```bash
# Clear npm cache
npm cache clean --force

# Clear Expo cache
expo start --clear

# Clear Metro bundler cache
npm start -- --reset-cache
```

## 📚 Dependencies

### Core Dependencies
- **expo**: Expo SDK for React Native
- **react-native**: React Native framework
- **@react-navigation/native**: Navigation library
- **expo-av**: Audio/video playback
- **expo-speech**: Text-to-speech functionality
- **@react-native-async-storage/async-storage**: Local storage

### Development Dependencies
- **typescript**: TypeScript support
- **@types/react**: React type definitions

## 🔧 Configuration

### app.json
Contains Expo configuration including:
- App name and slug
- Icon and splash screen paths
- iOS and Android specific settings
- Bundle identifiers

### tsconfig.json
TypeScript configuration with strict mode enabled.

### babel.config.js
Babel configuration for Expo with Reanimated plugin.

## 📝 Notes

- The app uses AsyncStorage for local data persistence
- Telugu TTS uses Expo Speech API
- All game data is stored locally
- The app works completely offline after initial load

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Expo documentation: [docs.expo.dev](https://docs.expo.dev)
3. Check React Navigation docs: [reactnavigation.org](https://reactnavigation.org)

## 📄 License

This project is part of the MyWayApps educational platform.

---

**Happy Learning! 🎓**

