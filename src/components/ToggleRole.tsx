import { Box, ToggleButton, ToggleButtonGroup, IconButton, Tooltip } from '@mui/material';
import { Contrast } from '@mui/icons-material';
import type { UserRole } from '../types';

interface ToggleRoleProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onHighContrastToggle: () => void;
  isHighContrast: boolean;
}

const ToggleRole = ({ currentRole, onRoleChange, onHighContrastToggle, isHighContrast }: ToggleRoleProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <ToggleButtonGroup
        value={currentRole}
        exclusive
        onChange={(_: React.MouseEvent<HTMLElement>, value: UserRole | null) => value && onRoleChange(value)}
        aria-label="user role"
        size="large"
      >
        <ToggleButton value="user" aria-label="user view">
          User View
        </ToggleButton>
        <ToggleButton value="caretaker" aria-label="caretaker view">
          Caretaker View
        </ToggleButton>
      </ToggleButtonGroup>

      <Tooltip title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}>
        <IconButton
          onClick={onHighContrastToggle}
          color={isHighContrast ? 'secondary' : 'default'}
          aria-label="toggle high contrast"
          size="large"
        >
          <Contrast />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToggleRole; 