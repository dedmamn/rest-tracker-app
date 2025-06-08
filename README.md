# Rest Tracker App - PWA

## Overview

The Rest Tracker App is a **Progressive Web App (PWA)** designed to help users track their leisure activities. It works both online and offline, stores data locally on your device, and can be installed like a native app.

## ✨ Key Features

- 📱 **Progressive Web App** - Install on any device
- 🔄 **Offline Support** - Works without internet connection
- 💾 **Local Data Storage** - All data stored on your device
- 🎨 **Responsive Design** - Perfect for mobile and desktop
- 🔔 **Smart Notifications** - Reminders for planned activities
- 📊 **Activity Tracking** - Comprehensive leisure activity management
- 🌙 **Dark/Light Theme** - Adaptive to your preferences
- 📤 **Data Export/Import** - Backup and restore your data

## 🚀 PWA Features

- **Installable**: Add to home screen on any device
- **Offline First**: Full functionality without internet
- **Fast Loading**: Cached resources for instant startup
- **Native Feel**: Runs like a native application
- **Auto Updates**: Seamless updates in the background

## 🎯 Activity Management

- Create leisure activities with customizable options
- Select activity types, add descriptions and notes
- Set up recurring activities and reminders
- View and manage your activity history
- Track time spent on different activities
- Generate activity statistics and insights

## 📁 Project Structure

```
rest-tracker-app/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── index.html             # PWA optimized
├── src/
│   ├── components/
│   │   ├── ActivityCard.tsx
│   │   ├── ActivityForm.tsx
│   │   ├── Navigation.tsx
│   │   ├── PWAInstallPrompt.tsx    # PWA installation
│   │   └── OfflineNotification.tsx # Offline support
│   ├── hooks/
│   │   ├── usePWA.ts              # PWA functionality
│   │   └── useDataManager.ts       # Data management
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Activities.tsx
│   │   └── Settings.tsx           # PWA settings
│   ├── utils/
│   │   ├── storage.ts             # localStorage manager
│   │   ├── enhancedStorage.ts     # IndexedDB manager
│   │   └── helpers.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── responsive.css
│   │   └── pwa.css               # PWA specific styles
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx                   # PWA enabled
│   └── index.tsx                 # Service Worker registration
├── PWA_GUIDE.md                  # Complete PWA setup guide
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rest-tracker-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rest-tracker-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000

### Production PWA

1. Build the app:
   ```bash
   npm run build
   ```
2. Serve the build:
   ```bash
   npm install -g serve
   serve -s build
   ```
3. Access your PWA at the provided URL

## 📱 Installing the App

### On Mobile (Android)

1. Open the app in Chrome/Firefox
2. Tap the "Add to Home Screen" prompt
3. Or use browser menu → "Install App"

### On Mobile (iOS)

1. Open the app in Safari
2. Tap Share button (⬆️)
3. Select "Add to Home Screen"
4. Tap "Add"

### On Desktop

1. Look for install icon in address bar
2. Click "Install App"
3. Or use browser menu → "Install Rest Tracker"

## 💾 Data Storage

The app uses **hybrid storage approach**:

- **Primary**: IndexedDB (unlimited storage, works offline)
- **Fallback**: localStorage (5-10MB limit, universal support)
- **Auto-switching**: Seamless fallback if IndexedDB unavailable

### Data Features:

- ✅ **Persistent**: Data survives app updates
- ✅ **Private**: Stored only on your device
- ✅ **Portable**: Export/import functionality
- ✅ **Reliable**: Automatic backups and recovery

## 🔄 Offline Functionality

**Works completely offline:**

- View all activities and data
- Add new activities
- Edit existing activities
- Change app settings
- Export/import data
- View statistics

**No internet required!** All data processing happens locally on your device.

## 🛠 Technologies Used

- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **PWA APIs** - Service Worker, Web App Manifest
- **IndexedDB** - Advanced local storage
- **React Router** - Client-side routing

## 🎨 Customization

### Theme Colors

Edit `public/manifest.json`:

```json
{
  "theme_color": "#4CAF50",
  "background_color": "#ffffff"
}
```

### App Icons

Replace icons in `public/`:

- `favicon.ico` (16x16, 32x32, 48x48)
- `logo192.png` (192x192)
- `logo512.png` (512x512)

## 🚦 Browser Support

### PWA Installation:

- ✅ Chrome/Chromium (Android, Desktop)
- ✅ Edge (Desktop)
- ✅ Safari (iOS, macOS) - manual install
- ✅ Firefox (Android)
- ✅ Samsung Internet

### Core Functionality:

- ✅ All modern browsers
- ✅ iOS Safari 11.3+
- ✅ Android WebView
- ✅ Desktop browsers

## 📋 PWA Checklist

- ✅ HTTPS required (automatic on most hosts)
- ✅ Service Worker registered
- ✅ Web App Manifest configured
- ✅ Offline functionality working
- ✅ Installable on all platforms
- ✅ Fast loading (cached resources)
- ✅ Responsive design
- ✅ Secure (CSP headers recommended)

## 🚀 Deployment

### Recommended Hosting:

- **Netlify** - Best PWA support, automatic HTTPS
- **Vercel** - Fast deployment, built-in PWA optimization
- **Firebase Hosting** - Google's PWA-optimized platform
- **GitHub Pages** - Free with HTTPS

### Deploy Steps:

1. `npm run build`
2. Upload `build/` folder to your host
3. Ensure HTTPS is enabled
4. Test PWA features

## 🔍 Testing PWA

### Chrome DevTools:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** and **Service Workers**
4. Run **Lighthouse** audit for PWA score

### Manual Testing:

- [ ] App loads offline
- [ ] Install prompt appears
- [ ] Data persists after browser restart
- [ ] Works in standalone mode
- [ ] Fast loading from cache

## 📖 Documentation

- [PWA_GUIDE.md](./PWA_GUIDE.md) - Complete PWA setup guide
- [Service Worker API](./public/sw.js) - Caching and offline strategy
- [Storage System](./src/utils/enhancedStorage.ts) - Data management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check [PWA_GUIDE.md](./PWA_GUIDE.md) for detailed setup
- Open GitHub issue for bugs
- PWA troubleshooting in browser DevTools

---

**Made with ❤️ as a Progressive Web App**

Install it on your device and enjoy tracking your leisure activities anywhere, anytime! 📱✨ 3. Install the dependencies:

```
npm install
```

## Usage

To start the application, run:

```
npm start
```

This will launch the app in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
