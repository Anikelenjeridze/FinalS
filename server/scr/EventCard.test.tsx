import { render, screen } 
import { EventCard } from 
import { Event } from 



const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  date: '2025-06-01',
  time: '14:30',
  location: 'Test Location',
  description: 'This is a test event description',
  category: 'Education',
  organizer: 'Test Organizer',
  createdAt: '2025-05-30T10:00:00Z'
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('This is a test event description')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Test Organizer')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Sun, Jun 1')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });

  it('applies correct category styling', () => {
    render(<EventCard event={mockEvent} />);
    const categoryBadge = screen.getByText('Education');
    expect(categoryBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });
});