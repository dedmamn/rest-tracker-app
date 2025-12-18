# Support

Thank you for using Rest Tracker App! This document provides guidance on how to get help and support.

## Getting Help

### Before Asking for Help

Before seeking support, please:

1. **Check the Documentation**
   - Read the [README.md](README.md) for basic usage instructions
   - Review the [CLAUDE.md](CLAUDE.md) for technical details
   - Check the [FAQ](#frequently-asked-questions) section below

2. **Search Existing Issues**
   - Browse [open issues](https://github.com/dedmamn/rest-tracker-app/issues) to see if your question has been answered
   - Check [closed issues](https://github.com/dedmamn/rest-tracker-app/issues?q=is%3Aissue+is%3Aclosed) for resolved problems

3. **Try Basic Troubleshooting**
   - Clear your browser cache and reload
   - Try a different browser
   - Check your browser's developer console for errors
   - Verify you're using a supported browser

## How to Get Support

### For General Questions

If you have a question about using the app:

1. **GitHub Discussions** (Recommended)
   - Visit [GitHub Discussions](https://github.com/dedmamn/rest-tracker-app/discussions)
   - Search existing discussions
   - Start a new discussion if your question hasn't been asked

2. **Question Issue Template**
   - Create a [new issue using the Question template](.github/ISSUE_TEMPLATE/question.yml)
   - Provide as much context as possible
   - Tag it appropriately

### For Bug Reports

If you've found a bug:

1. **Check if it's already reported**
   - Search [existing issues](https://github.com/dedmamn/rest-tracker-app/issues)

2. **Create a Bug Report**
   - Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml)
   - Include reproduction steps, screenshots, and environment details
   - Be as specific as possible

### For Feature Requests

If you have an idea for a new feature:

1. **Check existing feature requests**
   - Search [issues labeled "enhancement"](https://github.com/dedmamn/rest-tracker-app/labels/enhancement)

2. **Submit a Feature Request**
   - Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml)
   - Explain the problem and proposed solution
   - Include mockups or examples if possible

### For Security Issues

If you've discovered a security vulnerability:

- **Do NOT open a public issue**
- Follow the [Security Policy](SECURITY.md) for responsible disclosure
- Use GitHub Security Advisories or contact maintainers privately

## Response Times

Please note that this is an open-source project maintained by volunteers:

- **Critical Security Issues**: Within 48 hours
- **Bugs**: Within 5-7 business days
- **Feature Requests**: When time permits
- **General Questions**: Within 7 business days

Response times may vary based on maintainer availability and issue complexity.

## Frequently Asked Questions

### Installation and Setup

**Q: How do I install the Rest Tracker App?**

A: The app is a Progressive Web App (PWA). Visit https://dedmamn.github.io/rest-tracker-app/ in a supported browser and follow the install prompt.

**Q: Which browsers are supported?**

A: The app works best on:
- Chrome/Edge (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (Desktop & Mobile)

**Q: Can I use the app offline?**

A: Yes! The app is designed to work offline using service workers. Install it as a PWA for the best offline experience.

### Data and Privacy

**Q: Where is my data stored?**

A: All data is stored locally in your browser's localStorage. No data is sent to external servers.

**Q: How do I back up my data?**

A: Go to Settings → Export Data to download a JSON file with all your activities and settings.

**Q: How do I transfer data to another device?**

A: 
1. Export your data from the Settings page
2. Save the JSON file
3. On the new device, go to Settings → Import Data
4. Select your exported JSON file

**Q: Will clearing browser data delete my activities?**

A: Yes, clearing browser data/cache will delete your locally stored activities. Always export your data before clearing browser data.

### Features and Usage

**Q: What are the different activity types?**

A: The app tracks 9 types of rest activities:
- Physical (exercise, stretching)
- Emotional (journaling, therapy)
- Mental (breaks, mindfulness)
- Social (friends, family time)
- Sensory (nature, music)
- Spiritual (meditation, prayer)
- Creative (art, crafts)
- Outdoor (hiking, gardening)
- Passive (sleep, relaxation)

**Q: What is the fatigue test?**

A: The fatigue test helps identify which types of rest you need most by assessing your current state across different dimensions.

**Q: How do notifications work?**

A: You can enable reminders in Settings. The app will prompt you for notification permissions. Notifications work best when the app is installed as a PWA.

**Q: Can I edit or delete activities?**

A: Yes, navigate to the Activities page where you can view, edit, or delete any activity.

### Troubleshooting

**Q: The app isn't working offline. What should I do?**

A: 
1. Ensure the service worker is properly registered (check DevTools)
2. Try uninstalling and reinstalling the PWA
3. Clear browser cache and reload
4. Check browser console for errors

**Q: My data disappeared. How do I recover it?**

A: 
1. Check if you have an exported backup
2. Look in Settings → History for test results
3. Check browser localStorage in DevTools
4. If data migration occurred, check for old keys

**Q: The install prompt doesn't appear. How do I install the app?**

A:
- **Chrome/Edge**: Click the install icon in the address bar
- **Safari**: Tap Share → Add to Home Screen
- **Firefox**: Look for "Install" in the menu

**Q: I found a bug. What should I do?**

A: Please report it using our [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml). Include reproduction steps and your browser/device info.

## Development and Contributing

**Q: How can I contribute?**

A: We welcome contributions! Read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up the development environment
- Submitting pull requests
- Code style guidelines
- Testing requirements

**Q: I want to add a feature. Where do I start?**

A:
1. Check if the feature has already been requested
2. Open a feature request to discuss it
3. Wait for maintainer feedback
4. Fork the repository and start coding
5. Submit a pull request

**Q: How do I report a security vulnerability?**

A: Please follow our [Security Policy](SECURITY.md) and report vulnerabilities privately through GitHub Security Advisories.

## Additional Resources

- **Documentation**: [README.md](README.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Security**: [SECURITY.md](SECURITY.md)
- **License**: [LICENSE](LICENSE)
- **GitHub Discussions**: [Discussions](https://github.com/dedmamn/rest-tracker-app/discussions)
- **Issue Tracker**: [Issues](https://github.com/dedmamn/rest-tracker-app/issues)

## Community

Join our community:
- ⭐ Star the repository to show support
- 👁️ Watch the repository for updates
- 🍴 Fork the repository to contribute
- 💬 Participate in discussions
- 🐛 Report bugs and suggest features

## Contact

For matters not covered by this support document:
- Open a GitHub issue (for public questions)
- Use GitHub Discussions (for general topics)
- Follow the Security Policy (for vulnerabilities)

---

Thank you for using Rest Tracker App! We hope it helps you maintain a healthy balance of rest and activities. 💚
