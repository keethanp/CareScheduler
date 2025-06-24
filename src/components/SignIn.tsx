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
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
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
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          CareScheduler
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 3 }}>
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
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
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
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  I am a:
                </Typography>
                <Button
                  variant={role === 'user' ? 'contained' : 'outlined'}
                  onClick={() => setRole('user')}
                  sx={{ mr: 1 }}
                >
                  User
                </Button>
                <Button
                  variant={role === 'caretaker' ? 'contained' : 'outlined'}
                  onClick={() => setRole('caretaker')}
                >
                  Caretaker
                </Button>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
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