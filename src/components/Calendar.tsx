import { useState } from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addDays } from 'date-fns';
import type { Event } from '../types';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  events: Event[];
}

const Calendar = ({ selectedDate, onDateSelect, events }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get the start and end of the month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get the start and end of the week that contains the month start
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days for the calendar view (including padding days)
  const calendarDays = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date) ||
      (event.isRecurring && event.recurringDays?.includes(date.getDay()))
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <Box>
          <Button onClick={handlePrevMonth} aria-label="previous month">
            ←
          </Button>
          <Button onClick={handleNextMonth} aria-label="next month">
            →
          </Button>
        </Box>
      </Box>

      {/* Day Headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) => (
          <Typography
            key={day}
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 'bold', py: 1 }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Days */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {calendarDays.map((day: Date, index: number) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <Button
              key={day.toISOString()}
              fullWidth
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => onDateSelect(day)}
              sx={{
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                opacity: isCurrentMonth ? 1 : 0.5,
                position: 'relative',
                overflow: 'hidden',
                minWidth: 0, // Prevent button from expanding beyond grid
              }}
              aria-label={`${format(day, 'MMMM d, yyyy')}${dayEvents.length ? `, ${dayEvents.length} events` : ''}`}
            >
              <Typography variant="body2" sx={{ position: 'absolute', top: 4, left: 4 }}>
                {format(day, 'd')}
              </Typography>
              {dayEvents.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    right: 4,
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  {dayEvents.slice(0, 3).map(event => (
                    <Box
                      key={event.id}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      +{dayEvents.length - 3}
                    </Typography>
                  )}
                </Box>
              )}
            </Button>
          );
        })}
      </Box>
    </Paper>
  );
};

export default Calendar; 