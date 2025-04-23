import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

export const calendarService = {
  // Fetch all events for the current user
  getEvents: async () => {
    try {
      const records = await pb.collection('events').getFullList({
        sort: 'event_date',
        filter: `user = "${pb.authStore.model.id}"`
      });
      return records;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // Get a single event by ID
  getEvent: async (id) => {
    try {
      return await pb.collection('events').getOne(id);
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      // Combine date and time into a single ISO string for event_time
      const eventDateTime = new Date(`${eventData.date}T${eventData.time}`).toISOString();
      const data = {
        title: eventData.title,
        event_date: eventData.date,
        event_time: eventDateTime,
        user: pb.authStore.model.id
      };
      return await pb.collection('events').create(data);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (id) => {
    try {
      await pb.collection('events').delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }
};