
import { useState, useEffect } from 'react';
import { EventCard } from '../components/EventCard';
import { EventForm } from '../components/EventForm';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';



export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  organizer: string;
  createdAt: string;
}

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('communityEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {


      // Add some sample events for demonstration
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'Community Garden Workshop',
          date: '2025-06-05',
          time: '10:00',
          location: 'Maple Street Community Center',
          description: 'Learn about organic gardening techniques and help us plant this season\'s vegetables. Bring gloves and a water bottle!',
          category: 'Education',
          organizer: 'Green Thumbs Society',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Summer Block Party',
          date: '2025-06-15',
          time: '15:00',
          location: 'Oak Avenue Park',
          description: 'Join us for food, music, and fun activities for the whole family. Local vendors and live entertainment!',
          category: 'Social',
          organizer: 'Neighborhood Association',
          createdAt: new Date().toISOString()
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('communityEvents', JSON.stringify(sampleEvents));
    }
  }, []);




  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('communityEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    setShowForm(false);
  };

  const categories = ['all', 'Social', 'Education', 'Sports', 'Arts', 'Other'];

  const filteredEvents = events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Discover what's happening in your community</p>
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Post Event
          </Button>
        </div>

        

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All Events' : category}
            </button>
          ))}
        </div>




        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState 
            category={selectedCategory} 
            onCreateEvent={() => setShowForm(true)} 
          />
        )}

        {/* Event Form Modal */}
        {showForm && (
          <EventForm 
            onSubmit={addEvent}
            onClose={() => setShowForm(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;