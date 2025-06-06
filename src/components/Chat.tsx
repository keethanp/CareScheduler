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
import type { Message, UserRole } from '../types';

interface ChatProps {
  messages: Message[];
  userRole: UserRole;
  onSendMessage: (content: string) => void;
}

const Chat = ({ messages, userRole, onSendMessage }: ChatProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Messages
      </Typography>

      <List sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
        {messages.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((message, index) => (
            <Box key={message.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: message.sender === userRole ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    bgcolor: message.sender === userRole ? 'primary.main' : 'grey.100',
                    color: message.sender === userRole ? 'primary.contrastText' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      color: message.sender === userRole ? 'primary.contrastText' : 'text.secondary',
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
            placeholder="Type your message..."
            size="large"
            sx={{ bgcolor: 'background.paper' }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newMessage.trim()}
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