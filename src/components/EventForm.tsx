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
} from '@mui/material';
import type { Event } from '../types';

interface EventFormProps {
  onSubmit: (event: Omit<Event, 'id' | 'createdBy'>) => void;
}

const EventForm = ({ onSubmit }: EventFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      date: new Date(`${date}T${time}`),
      time,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : undefined,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setIsRecurring(false);
    setRecurringDays([]);
  };

  const handleDayToggle = (day: number) => {
    setRecurringDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Add New Event or Reminder
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            fullWidth
            size="large"
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
              required
              fullWidth
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
              <FormLabel component="legend">Repeat on:</FormLabel>
              <FormGroup row>
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
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            disabled={!title || !date || !time || (isRecurring && recurringDays.length === 0)}
          >
            Add Event
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EventForm; 