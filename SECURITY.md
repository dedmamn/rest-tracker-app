# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The Rest Tracker App team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the Security tab of this repository
   - Click "Report a vulnerability"
   - Fill out the form with details about the vulnerability

2. **Private Disclosure**
   - Email the maintainers through the contact information in the repository
   - Include "SECURITY" in the subject line
   - Provide detailed information about the vulnerability

### What to Include in Your Report

To help us better understand and resolve the issue, please include:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Full paths of affected source file(s)**
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue** - what an attacker could do with the vulnerability
- **Any suggested mitigation or remediation steps**

### What to Expect

After you submit a vulnerability report, you can expect:

1. **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
2. **Initial Assessment**: We'll provide an initial assessment within 5 business days
3. **Progress Updates**: We'll keep you informed of our progress
4. **Resolution**: We'll work on a fix and coordinate disclosure timing with you
5. **Credit**: We'll publicly credit you for the discovery (if you wish)

### Security Update Process

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release patches as soon as possible
5. Publish a security advisory on GitHub

## Security Best Practices

### For Users

- Keep your browser updated to the latest version
- Use the latest version of the Rest Tracker App
- Be cautious when exporting/importing data
- Review app permissions on your device
- Use strong device security (PIN, biometric, etc.)

### For Contributors

- Follow secure coding practices
- Never commit sensitive data (API keys, passwords, tokens)
- Validate and sanitize all user inputs
- Use parameterized queries to prevent injection attacks
- Keep dependencies updated and monitor for vulnerabilities
- Review the [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Known Security Considerations

### Data Storage

This application stores data locally in the browser using:
- **localStorage**: For activity data, settings, and test results
- **Service Worker Cache**: For offline functionality

Users should be aware that:
- Local data is not encrypted by default
- Data can be accessed by anyone with device access
- Exported data files should be stored securely
- Clearing browser data will delete all app data

### Privacy

The Rest Tracker App:
- ✅ Stores all data locally on your device
- ✅ Does not transmit data to external servers
- ✅ Does not collect analytics or tracking data
- ✅ Does not require user accounts or authentication
- ✅ Operates entirely client-side

### Service Worker

The app uses a service worker for offline functionality:
- Caches assets and data for offline use
- Updates automatically when new versions are available
- Can be inspected in browser DevTools

## Third-Party Dependencies

We regularly audit our dependencies for known vulnerabilities using:
- npm audit
- GitHub Dependabot alerts
- Manual security reviews

If you discover a vulnerability in a third-party dependency, please:
1. Report it to us following the process above
2. Consider reporting it to the dependency maintainers as well

## Security Updates and Notifications

To stay informed about security updates:
- Watch this repository for security advisories
- Enable GitHub notifications for security alerts
- Check the [Releases](https://github.com/dedmamn/rest-tracker-app/releases) page

## Scope

This security policy applies to:
- The Rest Tracker App source code in this repository
- The deployed application at https://dedmamn.github.io/rest-tracker-app/
- Official releases and distributions

Out of scope:
- Third-party forks or modifications
- Unofficial deployments
- Browser or device vulnerabilities

## Contact

For security-related questions or concerns, please:
- Open a security advisory on GitHub
- Contact the repository maintainers
- Review existing security advisories

## Acknowledgments

We thank the security research community for helping keep Rest Tracker App and our users safe. We appreciate responsible disclosure and will acknowledge your contribution.

---

**Last Updated**: December 2024
