# Faith-Frames

**Faith-Frames** is a mobile app built with **React Native** using **Expo**, combining two spiritual and engaging experiences:
- **Wallpapers**: Browse and set faith-inspired wallpapers.
- **Quizzes**: Test your knowledge with faith-themed quizzes.


## Project Overview

Faith-Frames is designed for users who want to combine their love for faith-based art with interactive learning. Access beautiful, faith-themed wallpapers and challenge yourself with spiritually enriching quizzes—all in one app.

---

## Tech Stack

| Part        | Technologies                              |
|-------------|-------------------------------------------|
| Frontend    | React Native, Expo                        |
| Quiz Backend| Node.js, Express, MongoDB                 |
| Wallpaper/Media Storage | Firebase (e.g. Firestore or Realtime Database) |
| API Hosting | Node server under the `Backend` directory  |
| Asset Handling | Managed by the `Pixar` directory         |

---

## Project Structure

```

Faith-Frames/
├── Pixar/        # Frontend: Expo React Native app
└── Backend/      # Server-side: Node.js, Express, MongoDB, Firebase integration

````

- **Pixar/**: Contains your mobile app code—UI components, screens, navigation, state management, and Firebase integration for wallpapers and quizzes.
- **Backend/**: Holds your API logic, including quiz routes, data models, and MongoDB setup.

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or newer recommended)  
- **npm** or **yarn**  
- **Expo CLI** — install with:
  ```bash
  npm install -g expo-cli
````

* **MongoDB** — local or Atlas cloud instance
* **Firebase project** — for storing or serving media assets (if applicable)

---

### Setup Steps

#### 1. Clone the repository

```bash
git clone https://github.com/BhanuPrakashPandey0843/Faith-Frames.git
cd Faith-Frames
```

#### 2. Install dependencies

* **Frontend (Pixar)**

  ```bash
  cd Pixar
  npm install
  ```

* **Backend**

  ```bash
  cd ../Backend
  npm install
  ```

#### 3. Configure environment

* In **Backend**: Create a `.env` file (or similar) with your MongoDB URI and Firebase credentials (if used).

  Example `.env`:

  ```
  MONGODB_URI=your_mongodb_connection_string
  FIREBASE_API_KEY=…
  FIREBASE_AUTH_DOMAIN=…
  FIREBASE_PROJECT_ID=…
  ...
  ```

* In **Pixar**: Add any Firebase config for your mobile app (e.g., in `firebaseConfig.js` or via environment variables).

#### 4. Run the backend server

```bash
cd Backend
npm start
```

#### 5. Launch the mobile app

```bash
cd ../Pixar
expo start
```

* Use the Expo Go app or a simulator/emulator to view the app.

---

## Usage

* **Wallpapers**: Browse the gallery, preview each wallpaper, and set it on your device (if supported).
* **Quizzes**: Choose a quiz topic or category and see your score upon completion. The questions, answers, and results are managed via the backend and stored in MongoDB.

---

## Features

* **Cross-platform mobile app** via Expo (iOS and Android)
* Structured backend with Express and MongoDB for quizzes
* Firebase integration for media handling and extras
* Easy-to-navigate codebase thanks to clear separation:

  * `Pixar/`: app UI and mobile logic
  * `Backend/`: server APIs and data models

---

## Contributing

Thanks for considering contributing to Faith-Frames! To get started:

1. **Fork** the repo.
2. Create your branch: `git checkout -b feat/your-feature`
3. Make your edits and test thoroughly.
4. Commit your changes: `git commit -m "Add feature XYZ"`
5. Push your branch and open a **Pull Request**.

Let’s keep contributions neat, purposeful, and well-tested!

---

## License

This project is open-source and available under the **MIT License**. See the `LICENSE` file for full details.

