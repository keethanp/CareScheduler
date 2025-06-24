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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '1.1rem' }}>
          {currentUser.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {currentUser.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
            {currentUser.role === 'caretaker' ? 'Caretaker' : 'User'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}>
          <IconButton
            onClick={onHighContrastToggle}
            color={isHighContrast ? 'secondary' : 'default'}
            aria-label="toggle high contrast"
            size="medium"
          >
            <Contrast />
          </IconButton>
        </Tooltip>

        <Tooltip title="Sign out">
          <IconButton
            onClick={onSignOut}
            color="default"
            aria-label="sign out"
            size="medium"
          >
            <Logout />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ToggleRole; 