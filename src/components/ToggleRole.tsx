import { Box, Button, IconButton, Tooltip, Typography, Avatar } from '@mui/material';
import { Contrast, Logout } from '@mui/icons-material';
import type { User } from '../types';

interface ToggleRoleProps {
  currentUser: User;
  onHighContrastToggle: () => void;
  onSignOut: () => void;
  isHighContrast: boolean;
}

const ToggleRole = ({ currentUser, onHighContrastToggle, onSignOut, isHighContrast }: ToggleRoleProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {currentUser.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {currentUser.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentUser.role === 'caretaker' ? 'Caretaker' : 'User'}
          </Typography>
        </Box>
      </Box>

      <Tooltip title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}>
        <IconButton
          onClick={onHighContrastToggle}
          color={isHighContrast ? 'secondary' : 'default'}
          aria-label="toggle high contrast"
        >
          <Contrast />
        </IconButton>
      </Tooltip>

      <Tooltip title="Sign out">
        <IconButton
          onClick={onSignOut}
          color="default"
          aria-label="sign out"
        >
          <Logout />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToggleRole; 