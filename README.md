# Charmius Holo Music Fest

React Native + TypeScript festival application using React Navigation.

## Run

```sh
npm install
npm start
npm run ios
npm run android
```

Install iOS dependencies with CocoaPods before the first native build. Node 22.11+ and the native React Native toolchains are required.

## Structure

- `src/screens`: splash, onboarding, catalogues, details, map, bookings and tickets
- `src/components`: shared controls, cards, SVG icons, map and dialogs
- `src/navigation`: typed stack and bottom-tab navigation
- `src/storage`: AsyncStorage persistence and reservation state
- `src/data`: supplied festival content and local image references
- `src/theme`: shared colours and styles
- `src/assets`: original project images

The splash uses a local WebView animation for four seconds. Completed onboarding and bookings persist across restarts. Bookings start empty. All images and festival content are bundled for offline use.

The catalogue comes from the supplied descriptions and mockups. The six-month programme runs from November 2026 through April 2027, with 15 performances repeating on the 21st–23rd each month (90 dated performances, Europe/Kyiv). Booking requires an upcoming occurrence; its date, time and timezone are saved with the reservation and QR payload. Existing undated reservations remain readable. The map is a schematic festival overview. QR codes encode local reservation references, shows and guest counts; there is no external inventory, payment, or admission-verification backend. Cancellation removes the local booking.

## Validation

```sh
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```

## Adaptive layouts and learning

Layouts respond to current window dimensions and safe-area insets rather than device names. Compact windows use single-column cards; expanded windows use grids and two-column detail, map and reservation views. Wide landscape windows use a side tab bar. iOS uses scene-based windows and supports rotation. Use Xcode 27.1 or newer for iPhone Duo testing.

The Tech tab links to Beyond the Stage, with six English resources from Oxford, Epic Games and Dolby. Search, type filters and saved links work locally; external articles and videos open in the browser and require internet access.

Screen transitions, aurora backgrounds and button feedback respect Reduce Motion. Continuous effects pause while the app is backgrounded or the screen is unfocused.
