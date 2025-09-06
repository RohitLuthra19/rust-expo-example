# Expo + Electron Desktop App

A complete setup guide for bundling Expo React Native apps into Electron desktop applications with distribution builds.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## 🚀 Quick Start

### 1. Clone or Download Project
```bash
git clone <your-repo-url>
cd expo-electron-app

# OR create from scratch
mkdir expo-electron-app
cd expo-electron-app
```

### 2. Initial Setup
```bash
# Install all dependencies (root + expo-app)
npm run setup
```

### 3. Development
```bash
# Build Expo web version and run Electron
npm run dev

# OR for hot reload during development
npm run dev:watch
```

### 4. Build for Distribution
```bash
# Create distributable packages (installers)
npm run dist

# OR create portable packages (no installer)
npm run pack
```

## 📁 Project Structure

```
expo-electron-app/
├── README.md
├── package.json              # Root config with build scripts
├── electron/                 # Electron main process
│   ├── main.js              # Main Electron app
│   └── preload.js           # Secure IPC bridge
├── expo-app/                # Expo React Native app
│   ├── package.json         # Expo dependencies
│   ├── app.json             # Expo configuration
│   ├── App.js               # Main React Native component
│   └── web-build/           # Generated web assets (auto-created)
├── dist/                    # Build output (auto-created)
│   ├── win-unpacked/        # Windows portable
│   ├── mac/                 # macOS app bundle
│   ├── linux-unpacked/      # Linux portable
│   └── *.exe, *.dmg, *.AppImage  # Installers
└── node_modules/            # Dependencies
```

## 🔧 Available Scripts

### Development Scripts
```bash
npm run setup        # Install all dependencies
npm run dev         # Build Expo + run Electron (production-like)
npm run dev:watch   # Hot reload development (requires 2 terminals)
npm run dev:debug   # Development with detailed logging
```

### Build Scripts
```bash
npm run build       # Full build (Expo + Electron)
npm run build:expo  # Build only Expo web version
npm run pack        # Create portable apps (no installer)
npm run dist        # Create installers for distribution
```

### Expo-specific Scripts
```bash
npm run expo:dev    # Start Expo dev server (for hot reload)
cd expo-app && npm run web  # Direct Expo web development
```

## 🏗️ Build Configuration

The app builds for all major platforms:

### Windows
- **Output**: `.exe` installer (NSIS)
- **Portable**: `win-unpacked/` folder
- **Requirements**: Works on Windows 7+

### macOS
- **Output**: `.dmg` installer
- **Portable**: `.app` bundle in `mac/` folder
- **Requirements**: macOS 10.10+

### Linux
- **Output**: `.AppImage` portable executable
- **Portable**: `linux-unpacked/` folder
- **Requirements**: Most Linux distributions

## 🔨 Customization

### App Information
Edit `package.json`:
```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "Your app description",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name"
  }
}
```

### Window Settings
Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1200,        // Change window size
  height: 800,
  minWidth: 800,      // Minimum window size
  minHeight: 600,
  // ... other options
});
```

### Expo App
All your React Native code goes in `expo-app/App.js`. Use standard React Native components - they work perfectly in the desktop environment.

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot find module" errors**
```bash
# Clean install
rm -rf node_modules expo-app/node_modules
npm run setup
```

**2. Expo build fails**
```bash
cd expo-app
npx expo install --fix
npm run build:web
```

**3. Electron won't start**
```bash
# Make sure Expo built successfully first
npm run build:expo
npm run dev
```

**4. Build files missing**
- Ensure `expo-app/web-build/` exists after running `npm run build:expo`
- Check that `electron/main.js` and `electron/preload.js` exist

### Development Tips

**Hot Reload Setup:**
1. Terminal 1: `npm run expo:dev` (starts Expo dev server)
2. Terminal 2: `npm run dev:watch` (starts Electron when Expo is ready)

**Production Testing:**
- Use `npm run dev` to test the exact build that will be distributed
- Use `npm run pack` to test the packaged app without creating installers

## 📦 Distribution

### Sharing Your App

After running `npm run dist`, you'll find:

**Windows users**: Share the `.exe` file from `dist/`
**Mac users**: Share the `.dmg` file from `dist/`  
**Linux users**: Share the `.AppImage` file from `dist/`

### File Sizes
- **Portable**: ~150-200MB (includes Electron runtime)
- **Installer**: Usually smaller due to compression
- **First run**: May be slower as OS verifies the app

### Code Signing (Optional)
For production apps, consider code signing:
- **Windows**: Get a code signing certificate
- **macOS**: Join Apple Developer Program
- **Linux**: Generally not required

Add to `package.json`:
```json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.p12",
    "certificatePassword": "password"
  },
  "mac": {
    "identity": "Developer ID Application: Your Name"
  }
}
```

## 🔄 Updating Your App

1. Update your Expo app in `expo-app/App.js`
2. Increment version in `package.json`
3. Build and distribute: `npm run dist`

For automatic updates, consider integrating `electron-updater`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in `expo-app/` for UI or `electron/` for desktop features
4. Test with `npm run dev`
5. Build with `npm run dist` to ensure it packages correctly
6. Submit a pull request

## 📄 License

[Add your license here]

## 🆘 Support

For issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try a clean install: `rm -rf node_modules && npm run setup`
4. Check [Electron docs](https://electronjs.org/docs) and [Expo docs](https://docs.expo.dev/)

---

**Happy building!** 🚀