# Rest Tracker App

## Overview
The Rest Tracker App is a web application designed to help users track their leisure activities. It allows users to create, manage, and view various leisure events, providing an easy way to organize and enjoy their free time.

## Features
- Create leisure activities with customizable options.
- Select the type of activity, enter a name, and provide a description.
- Set up recurrence options for regular activities.
- View and manage a list of created leisure activities.
- Responsive design for optimal use on mobile devices.

## Project Structure
```
rest-tracker-app
├── src
│   ├── components
│   │   ├── ActivityCard.tsx
│   │   ├── ActivityForm.tsx
│   │   └── Navigation.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Activities.tsx
│   │   └── Settings.tsx
│   ├── types
│   │   └── index.ts
│   ├── styles
│   │   ├── global.css
│   │   └── responsive.css
│   ├── utils
│   │   └── helpers.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rest-tracker-app.git
   ```
2. Navigate to the project directory:
   ```
   cd rest-tracker-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```
This will launch the app in your default web browser.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.