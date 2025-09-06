
# Tauri + Expo Cross-Platform Starter

This repo combines [Expo](https://expo.dev) (React Native) for Android, iOS, and Web with [Tauri](https://tauri.app) for Desktop (Windows, macOS, Linux). It lets you share code and UI across all platforms, with Tauri wrapping the Expo web build for desktop apps.

## Structure

- `expo-app/` — Your Expo project (React Native code, assets, components)
- `src-tauri/` — Tauri Rust backend and config
- `public/` — Static assets for web/desktop
- `package.json` — Scripts for dev/build

## Key Commands

### Development

- `npm run dev` — Starts Expo web, Tauri desktop, and injects Tauri bridge for desktop API access (requires [concurrently](https://www.npmjs.com/package/concurrently))
	- Expo web: hot reload for web/mobile
	- Tauri: wraps the web build for desktop

### Building

- `npm run build` — Builds Expo web, injects Tauri bridge, then builds Tauri desktop app

### Mobile/Web

- `cd expo-app && npx expo start` — Start Expo for Android/iOS/Web

### Desktop

- `npm run dev:tauri` — Start Tauri desktop app (wraps Expo web build)

## Features

- Shared UI and logic for all platforms
- Tauri API access in desktop via runtime bridge

## Troubleshooting

- If desktop links don't open, check tauri-plugin-opener setup and permissions
- If Tauri APIs aren't available, ensure the runtime bridge script is injected into `index.html` after Expo build

---

**Enjoy building cross-platform apps with Expo + Tauri!**
