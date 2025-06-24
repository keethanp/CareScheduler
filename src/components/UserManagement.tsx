import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import type { User, CareRequest } from '../types';

interface UserManagementProps {
  currentUser: User;
  users: User[];
  careRequests: CareRequest[];
  onSendCareRequest: (request: Omit<CareRequest, 'id' | 'status' | 'createdAt'>) => void;
  onToggleSelfSchedule: (userId: string, canSelfSchedule: boolean) => void;
  onAcceptCareRequest: (requestId: string) => void;
  onRejectCareRequest: (requestId: string) => void;
}

const UserManagement = ({
  currentUser,
  users,
  careRequests,
  onSendCareRequest,
  onToggleSelfSchedule,
  onAcceptCareRequest,
  onRejectCareRequest,
}: UserManagementProps) => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  const managedUsers = users.filter(user => user.caretakerId === currentUser.id);
  const availableUsers = users.filter(user => 
    user.role === 'user' && 
    !user.caretakerId && 
    user.id !== currentUser.id
  );
  const pendingRequests = careRequests.filter(
    request => request.fromCaretakerId === currentUser.id && request.status === 'pending'
  );

  const handleSendRequest = () => {
    if (selectedUser && requestMessage.trim()) {
      onSendCareRequest({
        fromCaretakerId: currentUser.id,
        toUserId: selectedUser.id,
        message: requestMessage,
      });
      setShowRequestDialog(false);
      setSelectedUser(null);
      setRequestMessage('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        User Management
      </Typography>

      {/* Managed Users */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Managed Users ({managedUsers.length})
        </Typography>
        {managedUsers.length === 0 ? (
          <Typography color="text.secondary">
            No users are currently under your care.
          </Typography>
        ) : (
          <List>
            {managedUsers.map((user) => (
              <ListItem key={user.id} divider>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.email} • ${user.canSelfSchedule ? 'Can self-schedule' : 'Cannot self-schedule'}`}
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Self-schedule:</Typography>
                    <Switch
                      checked={user.canSelfSchedule}
                      onChange={(e) => onToggleSelfSchedule(user.id, e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Available Users */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Available Users ({availableUsers.length})
        </Typography>
        {availableUsers.length === 0 ? (
          <Typography color="text.secondary">
            No users available to add to your care.
          </Typography>
        ) : (
          <List>
            {availableUsers.map((user) => (
              <ListItem key={user.id} divider>
                <ListItemText
                  primary={user.name}
                  secondary={user.email}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRequestDialog(true);
                    }}
                  >
                    Send Care Request
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Pending Requests */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Pending Care Requests ({pendingRequests.length})
        </Typography>
        {pendingRequests.length === 0 ? (
          <Typography color="text.secondary">
            No pending care requests.
          </Typography>
        ) : (
          <List>
            {pendingRequests.map((request) => {
              const targetUser = users.find(u => u.id === request.toUserId);
              return (
                <ListItem key={request.id} divider>
                  <ListItemText
                    primary={targetUser?.name || 'Unknown User'}
                    secondary={request.message}
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Pending" color="warning" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Care Request Dialog */}
      <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Care Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Send a care request to {selectedUser?.name}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Explain why you want to provide care for this user..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRequestDialog(false)}>Cancel</Button>
          <Button onClick={handleSendRequest} variant="contained">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserManagement; 