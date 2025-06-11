import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { eventRoutes } from '../routes/events';
import { errorHandler } from '../middleware/errorHandler';
import fs from 'fs/promises';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

describe('Integration Tests', () => {
  const testDataDir = path.join(__dirname, '../test-data');

  beforeEach(async () => {
    // Clean up test data directory before each test
    try {
      await fs.rm(testDataDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  afterAll(async () => {
    // Clean up test data directory after all tests
    try {
      await fs.rm(testDataDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('Health Check', () => {
    it('should return server status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'OK',
        message: 'Server is running'
      });
    });
  });

  describe('Full CRUD Flow', () => {
    it('should create, read, update, and delete events', async () => {
      // Create an event
      const eventData = {
        title: 'Integration Test Event',
        date: '2025-06-01',
        time: '14:30',
        location: 'Test Venue',
        description: 'This is a test event for integration testing',
        category: 'Education',
        organizer: 'Test Organizer'
      };

      const createResponse = await request(app)
        .post('/api/events')
        .send(eventData);

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toMatchObject(eventData);
      const eventId = createResponse.body.id;

      // Read all events
      const getAllResponse = await request(app).get('/api/events');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toHaveLength(1);
      expect(getAllResponse.body[0]).toMatchObject(eventData);

      // Read specific event
      const getOneResponse = await request(app).get(`/api/events/${eventId}`);
      expect(getOneResponse.status).toBe(200);
      expect(getOneResponse.body).toMatchObject(eventData);

      // Update event
      const updateData = {
        title: 'Updated Integration Test Event',
        category: 'Sports'
      };

      const updateResponse = await request(app)
        .put(`/api/events/${eventId}`)
        .send({
          ...eventData,
          ...updateData
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(updateData.title);
      expect(updateResponse.body.category).toBe(updateData.category);

      // Verify update
      const getUpdatedResponse = await request(app).get(`/api/events/${eventId}`);
      expect(getUpdatedResponse.status).toBe(200);
      expect(getUpdatedResponse.body.title).toBe(updateData.title);

      // Delete event
      const deleteResponse = await request(app).delete(`/api/events/${eventId}`);
      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getDeletedResponse = await request(app).get(`/api/events/${eventId}`);
      expect(getDeletedResponse.status).toBe(404);

      // Verify empty list
      const getEmptyResponse = await request(app).get('/api/events');
      expect(getEmptyResponse.status).toBe(200);
      expect(getEmptyResponse.body).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const invalidData = {
        title: '',
        date: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeInstanceOf(Array);
    });

    it('should handle not found errors', async () => {
      const response = await request(app).get('/api/events/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Event not found');
    });
  });
});