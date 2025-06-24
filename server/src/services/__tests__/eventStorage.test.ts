
import fs from 'fs/promises';
import path from 'path';
import { EventStorage } from '../eventStorage';
import { Event, CreateEventData } from '../../types/Event';

describe('EventStorage', () => {
  let eventStorage: EventStorage;
  const testDataDir = path.join(__dirname, '../../test-data');
  const testDataFile = path.join(testDataDir, 'events.json');

  beforeEach(() => {
    // Create a new instance with test data file
    eventStorage = new EventStorage();
    // Override the DATA_FILE path for testing
    (eventStorage as any).DATA_FILE = testDataFile;
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await fs.rm(testDataDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('getAllEvents', () => {
    it('should return empty array when no events exist', async () => {
      const events = await eventStorage.getAllEvents();
      expect(events).toEqual([]);
    });

    it('should return existing events', async () => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Test Event',
          date: '2025-06-01',
          time: '10:00',
          location: 'Test Location',
          description: 'Test Description',
          category: 'Social',
          organizer: 'Test Organizer',
          createdAt: '2025-01-01T00:00:00Z'
        }
      ];

      await fs.mkdir(testDataDir, { recursive: true });
      await fs.writeFile(testDataFile, JSON.stringify(mockEvents));

      const events = await eventStorage.getAllEvents();
      expect(events).toEqual(mockEvents);
    });
  });

  describe('getEventById', () => {
    it('should return null when event not found', async () => {
      const event = await eventStorage.getEventById('nonexistent');
      expect(event).toBeNull();
    });

    it('should return event when found', async () => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Test Event',
          date: '2025-06-01',
          time: '10:00',
          location: 'Test Location',
          description: 'Test Description',
          category: 'Social',
          organizer: 'Test Organizer',
          createdAt: '2025-01-01T00:00:00Z'
        }
      ];

      await fs.mkdir(testDataDir, { recursive: true });
      await fs.writeFile(testDataFile, JSON.stringify(mockEvents));

      const event = await eventStorage.getEventById('1');
      expect(event).toEqual(mockEvents[0]);
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventData: CreateEventData = {
        title: 'New Event',
        date: '2025-06-01',
        time: '10:00',
        location: 'New Location',
        description: 'New Description',
        category: 'Education',
        organizer: 'New Organizer'
      };

      const createdEvent = await eventStorage.createEvent(eventData);

      expect(createdEvent).toMatchObject(eventData);
      expect(createdEvent.id).toBeDefined();
      expect(createdEvent.createdAt).toBeDefined();

      const allEvents = await eventStorage.getAllEvents();
      expect(allEvents).toHaveLength(1);
      expect(allEvents[0]).toEqual(createdEvent);
    });
  });

  describe('updateEvent', () => {
    it('should return null when event not found', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedEvent = await eventStorage.updateEvent('nonexistent', updateData);
      expect(updatedEvent).toBeNull();
    });

    it('should update existing event', async () => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Test Event',
          date: '2025-06-01',
          time: '10:00',
          location: 'Test Location',
          description: 'Test Description',
          category: 'Social',
          organizer: 'Test Organizer',
          createdAt: '2025-01-01T00:00:00Z'
        }
      ];

      await fs.mkdir(testDataDir, { recursive: true });
      await fs.writeFile(testDataFile, JSON.stringify(mockEvents));

      const updateData = { title: 'Updated Title', category: 'Education' as const };
      const updatedEvent = await eventStorage.updateEvent('1', updateData);

      expect(updatedEvent).toMatchObject({
        ...mockEvents[0],
        ...updateData
      });
    });
  });

  describe('deleteEvent', () => {
    it('should return false when event not found', async () => {
      const deleted = await eventStorage.deleteEvent('nonexistent');
      expect(deleted).toBe(false);
    });

    it('should delete existing event', async () => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Test Event',
          date: '2025-06-01',
          time: '10:00',
          location: 'Test Location',
          description: 'Test Description',
          category: 'Social',
          organizer: 'Test Organizer',
          createdAt: '2025-01-01T00:00:00Z'
        }
      ];

      await fs.mkdir(testDataDir, { recursive: true });
      await fs.writeFile(testDataFile, JSON.stringify(mockEvents));

      const deleted = await eventStorage.deleteEvent('1');
      expect(deleted).toBe(true);

      const allEvents = await eventStorage.getAllEvents();
      expect(allEvents).toHaveLength(0);
    });
  });
});
