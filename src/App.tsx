import { useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material'
import type { AppState, UserRole, Event } from './types'
import ToggleRole from './components/ToggleRole'
import Calendar from './components/Calendar'
import EventForm from './components/EventForm'
import EventList from './components/EventList'
import Chat from './components/Chat'
import './App.css'

const initialAppState: AppState = {
  userRole: 'user',
  events: [],
  messages: [],
  selectedDate: new Date(),
  isHighContrast: false,
}

function App() {
  const [appState, setAppState] = useState<AppState>(initialAppState)

  const theme = createTheme({
    palette: {
      mode: appState.isHighContrast ? 'dark' : 'light',
      primary: {
        main: appState.isHighContrast ? '#ffffff' : '#1976d2',
      },
      secondary: {
        main: appState.isHighContrast ? '#ffff00' : '#dc004e',
      },
    },
    typography: {
      fontSize: 16,
      h1: { fontSize: '2.5rem' },
      h2: { fontSize: '2rem' },
      h3: { fontSize: '1.75rem' },
      button: { fontSize: '1.1rem' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            padding: '12px 24px',
            borderRadius: '8px',
          },
        },
      },
    },
  })

  const handleRoleToggle = (newRole: UserRole) => {
    setAppState(prev => ({ ...prev, userRole: newRole }))
  }

  const handleHighContrastToggle = () => {
    setAppState(prev => ({ ...prev, isHighContrast: !prev.isHighContrast }))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <h1>CareScheduler</h1>
            <ToggleRole
              currentRole={appState.userRole}
              onRoleChange={handleRoleToggle}
              onHighContrastToggle={handleHighContrastToggle}
              isHighContrast={appState.isHighContrast}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
            <Box>
              <Calendar
                selectedDate={appState.selectedDate}
                onDateSelect={(date: Date) => setAppState(prev => ({ ...prev, selectedDate: date }))}
                events={appState.events}
              />
              {appState.userRole === 'caretaker' && (
                <EventForm
                  onSubmit={(event: Omit<Event, 'id' | 'createdBy'>) => setAppState(prev => ({
                    ...prev,
                    events: [...prev.events, { ...event, id: Date.now().toString(), createdBy: prev.userRole }]
                  }))}
                />
              )}
              <EventList
                events={appState.events}
                selectedDate={appState.selectedDate}
                userRole={appState.userRole}
              />
            </Box>
            <Box>
              <Chat
                messages={appState.messages}
                userRole={appState.userRole}
                onSendMessage={(content: string) => setAppState(prev => ({
                  ...prev,
                  messages: [...prev.messages, {
                    id: Date.now().toString(),
                    content,
                    sender: prev.userRole,
                    timestamp: new Date()
                  }]
                }))}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
