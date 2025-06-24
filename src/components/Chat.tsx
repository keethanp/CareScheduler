import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import type { Message, User } from '../types';

interface ChatProps {
  messages: Message[];
  currentUser: User;
  users: User[];
  onSendMessage: (content: string, receiverId: string) => void;
}

const Chat = ({ messages, currentUser, users, onSendMessage }: ChatProps) => {
  const [newMessage, setNewMessage] = useState('');

  // Get messages relevant to the current user
  const getRelevantMessages = () => {
    if (currentUser.role === 'caretaker') {
      // Caretakers can see messages with their managed users
      const managedUserIds = users
        .filter(user => user.caretakerId === currentUser.id)
        .map(user => user.id);
      return messages.filter(message => 
        (message.sender === currentUser.id && managedUserIds.includes(message.receiver)) ||
        (managedUserIds.includes(message.sender) && message.receiver === currentUser.id)
      );
    } else {
      // Users can see messages with their caretaker
      const caretakerId = currentUser.caretakerId;
      if (!caretakerId) return [];
      return messages.filter(message => 
        (message.sender === currentUser.id && message.receiver === caretakerId) ||
        (message.sender === caretakerId && message.receiver === currentUser.id)
      );
    }
  };

  const relevantMessages = getRelevantMessages();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      let receiverId = '';
      if (currentUser.role === 'caretaker') {
        // For now, send to the first managed user (in a real app, you'd have a user selector)
        const managedUsers = users.filter(user => user.caretakerId === currentUser.id);
        if (managedUsers.length > 0) {
          receiverId = managedUsers[0].id;
        }
      } else {
        // Users send to their caretaker
        receiverId = currentUser.caretakerId || '';
      }
      
      if (receiverId) {
        onSendMessage(newMessage.trim(), receiverId);
        setNewMessage('');
      }
    }
  };

  const getSenderName = (senderId: string) => {
    const user = users.find(u => u.id === senderId);
    return user?.name || 'Unknown User';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Messages
      </Typography>

      <List sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
        {relevantMessages.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            {currentUser.role === 'caretaker' 
              ? 'No messages with your managed users yet.'
              : currentUser.caretakerId 
                ? 'No messages with your caretaker yet.'
                : 'You need to accept a care request to start messaging.'
            }
          </Typography>
        ) : (
          relevantMessages.map((message, index) => (
            <Box key={message.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: message.sender === currentUser.id ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    bgcolor: message.sender === currentUser.id ? 'primary.main' : 'grey.100',
                    color: message.sender === currentUser.id ? 'primary.contrastText' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  {currentUser.role === 'caretaker' && (
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>
                      {getSenderName(message.sender)}
                    </Typography>
                  )}
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      color: message.sender === currentUser.id ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {format(message.timestamp, 'MMM d, h:mm a')}
                  </Typography>
                </Box>
              </ListItem>
            </Box>
          ))
        )}
      </List>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            placeholder={
              currentUser.role === 'caretaker' 
                ? 'Type a message to your managed users...'
                : currentUser.caretakerId 
                  ? 'Type a message to your caretaker...'
                  : 'You need to accept a care request to send messages.'
            }
            disabled={!currentUser.caretakerId && currentUser.role === 'user'}
            sx={{ bgcolor: 'background.paper' }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newMessage.trim() || (!currentUser.caretakerId && currentUser.role === 'user')}
            sx={{ minWidth: 100 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Chat; 