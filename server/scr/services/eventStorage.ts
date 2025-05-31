import fs from 'fs/promises';
import path from 'path';
import { Event, CreateEventData, UpdateEventData } from '../types/Event';

  export class EventStorage {
  private DATA_FILE: string;

  constructor(dataFile?: string) {
    this.DATA_FILE = dataFile || path.join(__dirname, '../data/events.json');
  }

    private async ensureDataFile(): Promise<void> {
    try {
      await fs.access(this.DATA_FILE);
    } catch {
      // File doesn't exist, create it
      await fs.mkdir(path.dirname(this.DATA_FILE), { recursive: true });
      await fs.writeFile(this.DATA_FILE, JSON.stringify([]));
    }
  }

      async getAllEvents(): Promise<Event[]> {
    await this.ensureDataFile();
    const data = await fs.readFile(this.DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async getEventById(id: string): Promise<Event | null> {
    const events = await this.getAllEvents();
    return events.find(event => event.id === id) || null;
  }



  async createEvent(eventData: CreateEventData): Promise<Event> {
    const events = await this.getAllEvents();
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    



      events.unshift(newEvent);
    await fs.writeFile(this.DATA_FILE, JSON.stringify(events, null, 2));
    return newEvent;
  }

  async updateEvent(id: string, updateData: UpdateEventData): Promise<Event | null> {
    const events = await this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) {
      return null;
    }

    events[eventIndex] = { ...events[eventIndex], ...updateData };
    await fs.writeFile(this.DATA_FILE, JSON.stringify(events, null, 2));
    return events[eventIndex];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const events = await this.getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === events.length) {
      return false; // Event not found
    }

    await fs.writeFile(this.DATA_FILE, JSON.stringify(filteredEvents, null, 2));
    return true;
  }
}

  export const eventStorage = new EventStorage();