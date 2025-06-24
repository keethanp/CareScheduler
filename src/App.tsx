import { useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Container, Tabs, Tab } from '@mui/material'
import type { AppState, User, Event, Message, CareRequest } from './types'
import SignIn from './components/SignIn'
import ToggleRole from './components/ToggleRole'
import Calendar from './components/Calendar'
import EventForm from './components/EventForm'
import EventList from './components/EventList'
import Chat from './components/Chat'
import UserManagement from './components/UserManagement'
import CareRequests from './components/CareRequests'
import './App.css'

const initialAppState: AppState = {
  currentUser: null,
  users: [
    // Mock users for demonstration
    {
      id: '1',
      email: 'caretaker@example.com',
      name: 'Dr. Sarah Johnson',
      role: 'caretaker',
      canSelfSchedule: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      email: 'user1@example.com',
      name: 'John Smith',
      role: 'user',
      caretakerId: '1',
      canSelfSchedule: true,
      createdAt: new Date(),
    },
    {
      id: '3',
      email: 'user2@example.com',
      name: 'Mary Wilson',
      role: 'user',
      caretakerId: '1',
      canSelfSchedule: false,
      createdAt: new Date(),
    },
    {
      id: '4',
      email: 'user3@example.com',
      name: 'Bob Davis',
      role: 'user',
      canSelfSchedule: true,
      createdAt: new Date(),
    },
  ],
  events: [],
  messages: [],
  careRequests: [],
  selectedDate: new Date(),
  isHighContrast: false,
  isAuthenticated: false,
}

function App() {
  const [appState, setAppState] = useState<AppState>(initialAppState)
  const [activeTab, setActiveTab] = useState(0)

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

  const handleSignIn = (user: User) => {
    setAppState(prev => ({ 
      ...prev, 
      currentUser: user, 
      isAuthenticated: true 
    }))
  }

  const handleRegister = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    
    setAppState(prev => ({ 
      ...prev, 
      users: [...prev.users, newUser],
      currentUser: newUser,
      isAuthenticated: true
    }))
  }

  const handleSignOut = () => {
    setAppState(prev => ({ 
      ...prev, 
      currentUser: null, 
      isAuthenticated: false 
    }))
  }

  const handleHighContrastToggle = () => {
    setAppState(prev => ({ ...prev, isHighContrast: !prev.isHighContrast }))
  }

  const handleSendCareRequest = (request: Omit<CareRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: CareRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    }
    setAppState(prev => ({
      ...prev,
      careRequests: [...prev.careRequests, newRequest]
    }))
  }

  const handleAcceptCareRequest = (requestId: string) => {
    setAppState(prev => {
      const request = prev.careRequests.find(r => r.id === requestId)
      if (!request) return prev

      // Update the request status
      const updatedRequests = prev.careRequests.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' as const } : r
      )

      // Update the user to have a caretaker
      const updatedUsers = prev.users.map(user => 
        user.id === request.toUserId 
          ? { ...user, caretakerId: request.fromCaretakerId }
          : user
      )

      return {
        ...prev,
        careRequests: updatedRequests,
        users: updatedUsers
      }
    })
  }

  const handleRejectCareRequest = (requestId: string) => {
    setAppState(prev => ({
      ...prev,
      careRequests: prev.careRequests.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' as const } : r
      )
    }))
  }

  const handleToggleSelfSchedule = (userId: string, canSelfSchedule: boolean) => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId ? { ...user, canSelfSchedule } : user
      )
    }))
  }

  const handleSendMessage = (content: string, receiverId: string) => {
    if (!appState.currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: appState.currentUser.id,
      receiver: receiverId,
      timestamp: new Date()
    }

    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }))
  }

  // Show sign-in page if not authenticated
  if (!appState.isAuthenticated || !appState.currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SignIn onSignIn={handleSignIn} onRegister={handleRegister} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <h1>CareScheduler</h1>
            <ToggleRole
              currentUser={appState.currentUser}
              onHighContrastToggle={handleHighContrastToggle}
              onSignOut={handleSignOut}
              isHighContrast={appState.isHighContrast}
            />
          </Box>

          {/* Tabs for different views */}
          <Box sx={{ mb: 4 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Calendar" />
              <Tab label="Chat" />
              {appState.currentUser.role === 'caretaker' && (
                <Tab label="User Management" />
              )}
              {appState.currentUser.role === 'user' && (
                <Tab label="Care Requests" />
              )}
            </Tabs>
          </Box>

          {/* Calendar Tab */}
          {activeTab === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
              <Box>
                <Calendar
                  selectedDate={appState.selectedDate}
                  onDateSelect={(date: Date) => setAppState(prev => ({ ...prev, selectedDate: date }))}
                  events={appState.events}
                />
                <EventForm
                  currentUser={appState.currentUser}
                  users={appState.users}
                  onSubmit={(event: Omit<Event, 'id' | 'createdBy'>) => setAppState(prev => ({
                    ...prev,
                    events: [...prev.events, { ...event, id: Date.now().toString(), createdBy: prev.currentUser!.id }]
                  }))}
                />
                <EventList
                  events={appState.events}
                  selectedDate={appState.selectedDate}
                  currentUser={appState.currentUser}
                  users={appState.users}
                />
              </Box>
            </Box>
          )}

          {/* Chat Tab */}
          {activeTab === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 4 }}>
              <Chat
                messages={appState.messages}
                currentUser={appState.currentUser}
                users={appState.users}
                onSendMessage={handleSendMessage}
              />
            </Box>
          )}

          {/* User Management Tab (Caretakers only) */}
          {activeTab === 2 && appState.currentUser.role === 'caretaker' && (
            <UserManagement
              currentUser={appState.currentUser}
              users={appState.users}
              careRequests={appState.careRequests}
              onSendCareRequest={handleSendCareRequest}
              onToggleSelfSchedule={handleToggleSelfSchedule}
              onAcceptCareRequest={handleAcceptCareRequest}
              onRejectCareRequest={handleRejectCareRequest}
            />
          )}

          {/* Care Requests Tab (Users only) */}
          {activeTab === 2 && appState.currentUser.role === 'user' && (
            <CareRequests
              currentUser={appState.currentUser}
              users={appState.users}
              careRequests={appState.careRequests}
              onAcceptCareRequest={handleAcceptCareRequest}
              onRejectCareRequest={handleRejectCareRequest}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
