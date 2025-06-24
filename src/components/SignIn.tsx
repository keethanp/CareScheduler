import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import type { User } from '../types';

interface SignInProps {
  onSignIn: (user: User) => void;
  onRegister: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const SignIn = ({ onSignIn, onRegister }: SignInProps) => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'caretaker'>('user');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock authentication - in a real app, this would call an API
    // Use the email as the name for now, or extract name from email
    const nameFromEmail = email.split('@')[0];
    const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    const mockUser: User = {
      id: '1',
      email,
      name: displayName,
      role: 'user',
      canSelfSchedule: true,
      createdAt: new Date(),
    };

    onSignIn(mockUser);
  };

  const handleRegister = () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    const newUser: Omit<User, 'id' | 'createdAt'> = {
      email,
      name,
      role,
      canSelfSchedule: role === 'user',
    };

    onRegister(newUser);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        py: 4
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          CareScheduler
        </Typography>
        
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {tab === 0 ? (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                size="medium"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                size="medium"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
                size="medium"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                size="medium"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                size="medium"
              />
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  I am a:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant={role === 'user' ? 'contained' : 'outlined'}
                    onClick={() => setRole('user')}
                    fullWidth
                  >
                    User
                  </Button>
                  <Button
                    variant={role === 'caretaker' ? 'contained' : 'outlined'}
                    onClick={() => setRole('caretaker')}
                    fullWidth
                  >
                    Caretaker
                  </Button>
                </Box>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Register
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn; 