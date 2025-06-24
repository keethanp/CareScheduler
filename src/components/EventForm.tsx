import { useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  FormGroup,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import type { Event, User } from '../types';

interface EventFormProps {
  currentUser: User;
  users: User[];
  onSubmit: (event: Omit<Event, 'id' | 'createdBy'>) => void;
}

const EventForm = ({ currentUser, users, onSubmit }: EventFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  // Get users that the current user can create events for
  const getAvailableUsers = () => {
    if (currentUser.role === 'caretaker') {
      // Caretakers can create events for their managed users
      return users.filter(user => user.caretakerId === currentUser.id);
    } else {
      // Users can only create events for themselves
      return [currentUser];
    }
  };

  const availableUsers = getAvailableUsers();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Determine the user ID for the event
    const userId = currentUser.role === 'caretaker' ? selectedUserId : currentUser.id;
    
    onSubmit({
      title,
      description,
      date: new Date(`${date}T${time}`),
      time,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : undefined,
      userId,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setIsRecurring(false);
    setRecurringDays([]);
    setSelectedUserId('');
  };

  const handleDayToggle = (day: number) => {
    setRecurringDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  // Don't show form if user can't create events
  if (currentUser.role === 'user' && !currentUser.canSelfSchedule) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Event Management
        </Typography>
        <Typography color="text.secondary">
          Your caretaker has disabled self-scheduling. Please contact your caretaker to add events.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Add New Event or Reminder
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {currentUser.role === 'caretaker' && availableUsers.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>For User</InputLabel>
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
                label="For User"
                size="medium"
              >
                {availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            label="Title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            fullWidth
            size="medium"
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            size="medium"
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              required
              fullWidth
              size="medium"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
              required
              fullWidth
              size="medium"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isRecurring}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIsRecurring(e.target.checked)}
              />
            }
            label="Recurring Event"
          />

          {isRecurring && (
            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <FormLabel component="legend" sx={{ mb: 2 }}>Repeat on:</FormLabel>
              <FormGroup row sx={{ gap: 1, flexWrap: 'wrap' }}>
                {daysOfWeek.map(({ value, label }) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={recurringDays.includes(value)}
                        onChange={() => handleDayToggle(value)}
                      />
                    }
                    label={label}
                    sx={{ minWidth: 'fit-content' }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2, py: 1.5 }}
            disabled={
              !title || 
              !date || 
              !time || 
              (isRecurring && recurringDays.length === 0) ||
              (currentUser.role === 'caretaker' && !selectedUserId)
            }
          >
            Add Event
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EventForm; 