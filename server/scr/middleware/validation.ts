import { Request, Response, NextFunction } from 'express';
import { CreateEventData } from '../types/Event';

export const validateEventData = (req: Request, res: Response, next: NextFunction) => {
  const { title, date, time, location, description, category, organizer } = req.body as CreateEventData;

  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('Date is required and must be in YYYY-MM-DD format');
  }

  if (!time || typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    errors.push('Time is required and must be in HH:MM format');
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Location is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (!category || !['Social', 'Education', 'Sports', 'Arts', 'Other'].includes(category)) {
    errors.push('Category is required and must be one of: Social, Education, Sports, Arts, Other');
  }

  if (!organizer || typeof organizer !== 'string' || organizer.trim().length === 0) {
    errors.push('Organizer is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};