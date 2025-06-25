# CareScheduler

A simple scheduling and reminder tool designed for children and elderly users. This frontend-only React application focuses on accessibility, ease of use, and a clean interface.

![CareScheduler UI](./CareScheduler.png)

## Features

- **User Types**: Toggle between "User" and "Caretaker" views
- **Calendar View**: Interactive calendar with event display
- **Event Management**: Add one-time events and recurring reminders
- **Messaging System**: Simple chat interface for communication
- **Accessibility Features**:
  - High contrast mode
  - Large text and buttons
  - Responsive design
  - Screen reader support

## Complete Setup Instructions

### System Requirements

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** (alternative package manager)
- **Git** - [Download here](https://git-scm.com/)

### Step-by-Step Installation Guide

#### Step 1: Clone the Repository
1. Open your terminal/command prompt
2. Navigate to the directory where you want to store the project
3. Run the following command (replace `<your-github-username>` and `<repository-name>` with your actual GitHub details):
   ```bash
   git clone https://github.com/<your-github-username>/<repository-name>.git
   ```
4. Navigate into the project directory:
   ```bash
   cd <repository-name>
   ```

#### Step 2: Navigate to the CareScheduler App
Since this is a monorepo with the app in a subdirectory:
```bash
cd carescheduler
```

#### Step 3: Install Dependencies
Install all required packages:
```bash
npm install
```

**Note**: This may take a few minutes depending on your internet connection.

#### Step 4: Start the Development Server
Run the development server:
```bash
npm run dev
```

You should see output similar to:
```
> carescheduler@0.0.0 dev
> vite
  VITE v6.3.5  ready in 583 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Step 5: Open the Application
1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. The CareScheduler application should now be running!

### Troubleshooting Common Issues

#### Issue: "Command not found: npm"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

#### Issue: "Port 5173 is already in use"
**Solution**: 
1. Find what's using the port: `lsof -i :5173` (Linux/Mac) or `netstat -ano | findstr :5173` (Windows)
2. Kill the process or use a different port: `npm run dev -- --port 3000`

#### Issue: "Module not found" errors
**Solution**: 
1. Delete the `node_modules` folder and `package-lock.json`
2. Run `npm install` again

#### Issue: "Permission denied" errors
**Solution**: 
1. On Linux/Mac, try: `sudo npm install`
2. Or fix npm permissions: `npm config set prefix ~/.npm-global`

#### Issue: App doesn't load or shows errors
**Solution**:
1. Check the browser console (F12) for error messages
2. Make sure all dependencies are installed: `npm install`
3. Try clearing browser cache and refreshing

### Available Scripts

- `npm run dev` - Start development server (recommended for development)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking

### Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in the `src/` directory
3. **See Changes**: The app automatically reloads when you save files
4. **Stop Server**: Press `Ctrl+C` in the terminal

### Project Structure
```
carescheduler/
├── src/
│   ├── components/     # React components
│   │   ├── Calendar.tsx
│   │   ├── CareRequests.tsx
│   │   ├── Chat.tsx
│   │   ├── EventForm.tsx
│   │   ├── EventList.tsx
│   │   ├── SignIn.tsx
│   │   ├── ToggleRole.tsx
│   │   └── UserManagement.tsx
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

### Technologies Used

- **React 19** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Material-UI (MUI)** - UI component library
- **date-fns** - Date manipulation library
- **ESLint** - Code linting

## Usage

### User View
- View scheduled events and reminders
- Send messages to caretakers
- Navigate the calendar

### Caretaker View
- Add new events and reminders
- Set up recurring events
- View and respond to messages
- Manage the schedule

### Accessibility Features
- Toggle high contrast mode using the contrast icon
- Use keyboard navigation (Tab, Enter, Space)
- Screen reader compatible
- Responsive design for all devices

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Create an issue on GitHub with details about your problem

## License

This project is open source and available under the [MIT License](LICENSE).
