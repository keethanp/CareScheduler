import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
} from '@mui/material';
import type { User, CareRequest } from '../types';

interface CareRequestsProps {
  currentUser: User;
  users: User[];
  careRequests: CareRequest[];
  onAcceptCareRequest: (requestId: string) => void;
  onRejectCareRequest: (requestId: string) => void;
}

const CareRequests = ({
  currentUser,
  users,
  careRequests,
  onAcceptCareRequest,
  onRejectCareRequest,
}: CareRequestsProps) => {
  const incomingRequests = careRequests.filter(
    request => request.toUserId === currentUser.id
  );

  const getCaretakerName = (caretakerId: string) => {
    const caretaker = users.find(u => u.id === caretakerId);
    return caretaker?.name || 'Unknown Caretaker';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (incomingRequests.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Care Requests
        </Typography>
        <Alert severity="info">
          No care requests at this time.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Care Requests ({incomingRequests.length})
      </Typography>

      <List>
        {incomingRequests.map((request) => (
          <ListItem key={request.id} divider>
            <ListItemText
              primary={getCaretakerName(request.fromCaretakerId)}
              secondary={
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {request.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sent on {request.createdAt.toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={getStatusText(request.status)} 
                  color={getStatusColor(request.status) as any}
                  size="small"
                />
                {request.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onAcceptCareRequest(request.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onRejectCareRequest(request.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CareRequests; 