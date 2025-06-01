
import request from 'supertest';
import express from 'express';
import { eventRoutes } from '../events';
import { eventStorage } from '../../services/eventStorage';
import { Event } from '../../types/Event';

// Mock the eventStorage
jest.mock('../../services/eventStorage');

const app = express();
app.use(express.json());
app.use('/api/events', eventRoutes);

const mockEventStorage = eventStorage as jest.Mocked<typeof eventStorage>;

describe('Events Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/events', () => {
    it('should return all events', async () => {
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

      mockEventStorage.getAllEvents.mockResolvedValue(mockEvents);

      const response = await request(app).get('/api/events');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
      expect(mockEventStorage.getAllEvents).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      mockEventStorage.getAllEvents.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/events');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return event by id', async () => {
      const mockEvent: Event = {
        id: '1',
        title: 'Test Event',
        date: '2025-06-01',
        time: '10:00',
        location: 'Test Location',
        description: 'Test Description',
        category: 'Social',
        organizer: 'Test Organizer',
        createdAt: '2025-01-01T00:00:00Z'
      };

      mockEventStorage.getEventById.mockResolvedValue(mockEvent);

      const response = await request(app).get('/api/events/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
      expect(mockEventStorage.getEventById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when event not found', async () => {
      mockEventStorage.getEventById.mockResolvedValue(null);

      const response = await request(app).get('/api/events/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });
  });

  describe('POST /api/events', () => {
    it('should create new event with valid data', async () => {
      const eventData = {
        title: 'New Event',
        date: '2025-06-01',
        time: '10:00',
        location: 'New Location',
        description: 'New Description',
        category: 'Education',
        organizer: 'New Organizer'
      };

      const createdEvent: Event = {
        ...eventData,
        id: '1',
        createdAt: '2025-01-01T00:00:00Z'
      };

      mockEventStorage.createEvent.mockResolvedValue(createdEvent);

      const response = await request(app)
        .post('/api/events')
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdEvent);
      expect(mockEventStorage.createEvent).toHaveBeenCalledWith(eventData);
    });

    it('should return 400 with invalid data', async () => {
      const invalidData = {
        title: '',
        date: 'invalid',
        time: 'invalid'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update existing event', async () => {
      const updateData = {
        title: 'Updated Event',
        date: '2025-06-01',
        time: '10:00',
        location: 'Updated Location',
        description: 'Updated Description',
        category: 'Sports' as const,
        organizer: 'Updated Organizer'
      };

      const updatedEvent: Event = {
        ...updateData,
        id: '1',
        createdAt: '2025-01-01T00:00:00Z'
      };

      mockEventStorage.updateEvent.mockResolvedValue(updatedEvent);

      const response = await request(app)
        .put('/api/events/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEvent);
      expect(mockEventStorage.updateEvent).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 when event not found', async () => {
      const updateData = {
        title: 'Updated Event',
        date: '2025-06-01',
        time: '10:00',
        location: 'Updated Location',
        description: 'Updated Description',
        category: 'Sports' as const,
        organizer: 'Updated Organizer'
      };

      mockEventStorage.updateEvent.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/events/nonexistent')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete existing event', async () => {
      mockEventStorage.deleteEvent.mockResolvedValue(true);

      const response = await request(app).delete('/api/events/1');

      expect(response.status).toBe(204);
      expect(mockEventStorage.deleteEvent).toHaveBeenCalledWith('1');
    });

    it('should return 404 when event not found', async () => {
      mockEventStorage.deleteEvent.mockResolvedValue(false);

      const response = await request(app).delete('/api/events/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });
  });
});