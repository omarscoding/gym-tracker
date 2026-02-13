# Gym Tracker

A minimal Expo React Native app for tracking gym streaks.

## Features

- **Home Screen**: Title "Gym Streak" with two buttons:
  - Set Reference Photo
  - Daily Check-in
- **Camera Screen**: Take photos with camera permission handling and preview

## Tech Stack

- Expo SDK 52
- React Native
- TypeScript
- Expo Router (file-based routing)
- expo-camera

## Getting Started

### Prerequisites

- Node.js installed
- Expo Go app on your phone (iOS or Android)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/omarscoding/gym-tracker.git
cd gym-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

### Running with Expo Go

1. Install Expo Go on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. After running `npx expo start`, you'll see a QR code in your terminal

3. Scan the QR code:
   - **iOS**: Open the Camera app and scan the QR code
   - **Android**: Open Expo Go app and use the built-in scanner

4. The app will load on your device

### Development Commands

- `npm start` - Start the Expo development server
- `npm run android` - Open on Android emulator/device
- `npm run ios` - Open on iOS simulator/device
- `npm run web` - Open in web browser

## Project Structure

```
gym-tracker/
├── app/
│   ├── _layout.tsx      # Root layout with navigation
│   ├── index.tsx        # Home screen
│   └── camera.tsx       # Camera screen
├── assets/              # Images and app icons
├── app.json            # Expo configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## Usage

1. Launch the app to see the Home screen
2. Tap "Set Reference Photo" or "Daily Check-in" to open the camera
3. Grant camera permissions when prompted
4. Take a photo using the capture button
5. Preview the photo and tap "Return Home" to go back

## Notes

- No backend or database - photos are not persisted
- No AI features
- Minimal styling for MVP purposes
- Camera permissions are required for the camera feature

