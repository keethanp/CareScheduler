import { Paper, Typography, List, ListItem, ListItemText, Divider, Box, Chip } from '@mui/material';
import { format, isSameDay } from 'date-fns';
import type { Event, User } from '../types';

interface EventListProps {
  events: Event[];
  selectedDate: Date | null;
  currentUser: User;
  users: User[];
}

const EventList = ({ events, selectedDate, currentUser, users }: EventListProps) => {
  // Get events that the current user can see
  const getVisibleEvents = () => {
    if (currentUser.role === 'caretaker') {
      // Caretakers can see events for their managed users
      const managedUserIds = users
        .filter(user => user.caretakerId === currentUser.id)
        .map(user => user.id);
      return events.filter(event => managedUserIds.includes(event.userId));
    } else {
      // Users can only see their own events
      return events.filter(event => event.userId === currentUser.id);
    }
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const visibleEvents = getVisibleEvents();
    return visibleEvents.filter(event => 
      isSameDay(new Date(event.date), selectedDate) ||
      (event.isRecurring && event.recurringDays?.includes(selectedDate.getDay()))
    );
  };

  const getRecurringEvents = () => {
    return getVisibleEvents().filter(event => event.isRecurring);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const selectedDateEvents = getEventsForSelectedDate();
  const recurringEvents = getRecurringEvents();

  if (!selectedDate) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Events for {format(selectedDate, 'MMMM d, yyyy')}
      </Typography>

      {selectedDateEvents.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No events scheduled for this date.
        </Typography>
      ) : (
        <List>
          {selectedDateEvents.map((event, index) => (
            <Box key={event.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="span">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {event.description}
                      </Typography>
                      {currentUser.role === 'caretaker' && (
                        <Chip 
                          label={getUserName(event.userId)} 
                          size="small" 
                          sx={{ mt: 0.5, mr: 0.5 }}
                        />
                      )}
                      {event.isRecurring && (
                        <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                          Recurring event
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}

      {recurringEvents.length > 0 && (
        <>
          <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
            Recurring Events
          </Typography>
          <List>
            {recurringEvents.map((event, index) => (
              <Box key={event.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span">
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {event.description}
                        </Typography>
                        {currentUser.role === 'caretaker' && (
                          <Chip 
                            label={getUserName(event.userId)} 
                            size="small" 
                            sx={{ mt: 0.5, mr: 0.5 }}
                          />
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Repeats on: {event.recurringDays?.map(day => 
                            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                          ).join(', ')}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};

export default EventList; 