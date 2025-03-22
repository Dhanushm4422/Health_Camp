# MediConnect - Health Camp Expo App

## Description
MediConnect is a mobile application designed to help NGOs, health organizations, and medical students manage free health camps, vaccination drives, and emergency services. The platform enables admins to create, edit, and manage health camps with essential details like location, time, available doctors, ambulances, and more. Users can register for camps and provide feedback after attending.

## Features
### Admin Panel
- Admins (NGOs, health students) have personalized dashboards.
- Add, edit, and delete health camp details.
- Store camp data in Firebase.
- Manage health camps with:
  - Name, geo-location, date, time
  - Images, ambulances, doctors
  - Nearby hospitals, registration URLs

### User Features
- View upcoming and past health camps.
- Register for camps.
- Post complaints or feedback with images.
- Access emergency services.

### Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Styling**: Tailwind CSS, Custom UI components

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Dhanushm4422/Health_Camp.git
   cd Health_Camp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   ```sh
   npx expo start
   ```

## Firebase Setup
1. Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore, Authentication, and Storage.
3. Add Firebase config to your project:
   - Create a `firebaseConfig.js` file in the `src/config` directory.
   - Paste the Firebase credentials.
   ```javascript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
   
**MediConnect** - Bringing Healthcare Closer to Communities 🚑

