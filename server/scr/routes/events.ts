
import { Router } from 'express';
import { eventStorage } from '../services/eventStorage';
import { validateEventData } from '../middleware/validation';

const router = Router();





 //   GET /api/events - Get all events
router.get('/', async (req, res, next) => {
  try {
    const events = await eventStorage.getAllEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
});



// GET /api/events/:id - Get event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const event = await eventStorage.getEventById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

//        POST /api/events - Create new event
router.post('/', validateEventData, async (req, res, next) => {
  try {
    const newEvent = await eventStorage.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
});




// PUT /api/events/:id - Update event
router.put('/:id', validateEventData, async (req, res, next) => {
  try {
    const updatedEvent = await eventStorage.updateEvent(req.params.id, req.body);
    
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
});




// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await eventStorage.deleteEvent(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as eventRoutes };