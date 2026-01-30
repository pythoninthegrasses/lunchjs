# Privacy Policy

**Effective Date:** January 30, 2026

## About the App

Lunch is a cross-platform restaurant selector app that helps you randomly choose where to eat from your personal list of restaurants. It is available for macOS, iOS, and Android.

## Data Collection

**Lunch does not collect, transmit, or share any personal data.**

All operations are performed entirely on your device. The app does not communicate with any external servers.

## Local Data Storage

When you use Lunch, the following data is stored locally on your device:

- **Restaurant List**: Names and categories (cheap/normal) of restaurants you add
- **Recent Selections**: The last 14 restaurants selected to avoid immediate repeats

This data is stored in a local SQLite database:
- **macOS**: `~/Library/Application Support/Lunch/lunch.db`
- **iOS/Android**: App data directory (sandboxed, not accessible by other apps)

## No Network Access

Lunch does not:
- Make any network requests
- Connect to any servers
- Collect analytics or telemetry
- Require an internet connection

## Data Deletion

To delete all your data:
- **macOS**: Delete the app and remove `~/Library/Application Support/Lunch/`
- **iOS/Android**: Uninstalling the app removes all associated data

## Third-Party Services

Lunch does not integrate with any third-party services, SDKs, or analytics platforms.

## Changes to This Policy

If this privacy policy changes, the updated version will be posted in the app repository and the effective date will be updated.

## Contact

If you have any questions or suggestions regarding this privacy policy, please open an issue on [GitHub](https://github.com/pythoninthegrass/lunchjs/issues).
