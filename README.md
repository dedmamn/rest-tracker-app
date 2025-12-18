# Rest Tracker App - PWA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://dedmamn.github.io/rest-tracker-app/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg)](CODE_OF_CONDUCT.md)

A Progressive Web App (PWA) for tracking and managing leisure activities with adaptive design for mobile devices. Built with React, TypeScript, and Material-UI, featuring offline support and a comprehensive fatigue assessment system.

## ✨ Features

- 📱 **Progressive Web App** - Install on any device, works offline
- 🎯 **Activity Tracking** - Track 9 types of rest activities (physical, emotional, mental, social, sensory, spiritual, creative, outdoor, passive)
- 🧪 **Fatigue Testing** - Assess your current state and get personalized rest recommendations
- 🔔 **Smart Reminders** - Configurable notifications to maintain healthy rest habits
- 💾 **Data Management** - Export/import your data, automatic backups
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 📊 **Activity History** - View and analyze your rest patterns
- 🔄 **Recurring Activities** - Schedule repeating activities
- 📴 **Offline First** - Full functionality without internet connection

## 🚀 Quick Start

### Try It Now

Visit the live demo: **[https://dedmamn.github.io/rest-tracker-app/](https://dedmamn.github.io/rest-tracker-app/)**

### Install as PWA

1. Open the app in your browser
2. Look for the "Install" prompt or menu option
3. Follow your browser's installation steps

**Desktop:**
- Chrome/Edge: Click the install icon in the address bar
- Firefox: Menu → Install This Site as an App

**Mobile:**
- Chrome/Edge: Menu → Add to Home Screen
- Safari: Share → Add to Home Screen

## 🛠️ Development

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/dedmamn/rest-tracker-app.git
cd rest-tracker-app

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`.

### Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

### Project Structure

```
rest-tracker-app/
├── public/              # Static files and PWA assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── icons/          # App icons
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── .github/            # GitHub configuration
│   ├── workflows/      # CI/CD workflows
│   └── ISSUE_TEMPLATE/ # Issue templates
└── package.json
```

## 📖 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines
- **[Security Policy](SECURITY.md)** - Security and vulnerability reporting
- **[Support](SUPPORT.md)** - Getting help and FAQ
- **[Technical Details](CLAUDE.md)** - Architecture and development details

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

1. Check out the [Contributing Guide](CONTRIBUTING.md)
2. Look for [good first issues](https://github.com/dedmamn/rest-tracker-app/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
3. Join the discussion in [GitHub Discussions](https://github.com/dedmamn/rest-tracker-app/discussions)

## 🐛 Bug Reports & Feature Requests

- **Found a bug?** [Report it here](https://github.com/dedmamn/rest-tracker-app/issues/new?template=bug_report.yml)
- **Have an idea?** [Request a feature](https://github.com/dedmamn/rest-tracker-app/issues/new?template=feature_request.yml)
- **Need help?** [Ask a question](https://github.com/dedmamn/rest-tracker-app/issues/new?template=question.yml)

## 🔒 Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) for responsible disclosure.

## 📱 Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)

## 🌟 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **React Router** - Navigation
- **Service Workers** - Offline support
- **localStorage** - Data persistence

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- UI components from [Material-UI](https://mui.com/)
- Icons from [Material Icons](https://mui.com/material-ui/material-icons/)

## 📞 Contact & Support

- 📫 [Open an issue](https://github.com/dedmamn/rest-tracker-app/issues)
- 💬 [GitHub Discussions](https://github.com/dedmamn/rest-tracker-app/discussions)
- 📖 [Documentation](SUPPORT.md)

---

Made with ❤️ by the Rest Tracker App community
