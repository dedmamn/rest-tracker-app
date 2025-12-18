# Contributing to Rest Tracker App

First off, thank you for considering contributing to Rest Tracker App! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [React Best Practices](#react-best-practices)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Note your browser, device, and OS**

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) when creating an issue.

### Suggesting Features

Feature suggestions are welcome! When suggesting a feature:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this feature would be useful**
- **Include mockups or examples if possible**

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml) when creating an issue.

### Code Contributions

#### First Time Contributors

Look for issues labeled `good first issue` or `help wanted`. These are great starting points for new contributors.

#### Development Process

1. Fork the repository
2. Create a new branch from `main` for your feature or bugfix
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes with clear commit messages
6. Push to your fork
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm

### Setup Steps

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/rest-tracker-app.git
cd rest-tracker-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
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
├── public/          # Static files and PWA assets
├── src/
│   ├── components/  # React components
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── styles/      # CSS styles
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── .github/         # GitHub configuration
└── package.json
```

## Pull Request Process

1. **Update Documentation**: Update the README.md or other documentation if needed
2. **Test Thoroughly**: 
   - Test on desktop and mobile browsers
   - Test offline functionality (PWA features)
   - Ensure existing tests pass
3. **Follow the PR Template**: Fill out all sections of the pull request template
4. **Keep PRs Focused**: One feature or bug fix per PR
5. **Write Clear Commit Messages**: Follow our commit message guidelines
6. **Be Responsive**: Respond to review comments promptly
7. **Squash When Ready**: Consider squashing commits before merge if requested

### PR Review Process

- At least one maintainer review is required
- All CI checks must pass
- Code must follow the project's style guidelines
- Changes must be tested in relevant browsers and devices

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` - Improve structure/format of code
  - ⚡️ `:zap:` - Improve performance
  - 🐛 `:bug:` - Fix a bug
  - ✨ `:sparkles:` - Add new feature
  - 📝 `:memo:` - Add or update documentation
  - 🚀 `:rocket:` - Deploy stuff
  - 💄 `:lipstick:` - Add or update UI styles
  - ✅ `:white_check_mark:` - Add or update tests
  - 🔒 `:lock:` - Fix security issues
  - ♿️ `:wheelchair:` - Improve accessibility

### TypeScript Style Guide

- Use TypeScript for all new files
- Define interfaces for component props
- Avoid `any` type when possible
- Use strict type checking
- Export types from `src/types/index.ts`

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Implement proper prop validation
- Handle loading and error states
- Follow Material-UI best practices
- Ensure mobile responsiveness
- Test PWA features (offline support, caching)

### CSS Guidelines

- Use Material-UI's styling solution when possible
- Keep styles co-located with components when appropriate
- Use responsive design patterns (mobile-first)
- Test on different screen sizes
- Follow the existing style structure

## PWA-Specific Considerations

When working with PWA features:

- Test offline functionality using DevTools
- Verify service worker updates correctly
- Test on actual mobile devices when possible
- Ensure proper caching strategies
- Test app installation flow
- Verify manifest.json changes

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices (iOS and Android)
- Test offline mode functionality

## Questions?

Feel free to:
- Open an issue with the [question template](.github/ISSUE_TEMPLATE/question.yml)
- Start a discussion in [GitHub Discussions](https://github.com/dedmamn/rest-tracker-app/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Rest Tracker App! 🎉
