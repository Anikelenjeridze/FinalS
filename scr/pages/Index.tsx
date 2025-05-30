import { useState, useEffect, useMemo } from 'react';
import { EventCard } from '../components/EventCard';
import { EventForm } from '../components/EventForm';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { SortControls } from '../components/SortControls';
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

export type SortBy = 'date' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // ... keep existing code (useEffect hooks for localStorage)

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

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    // Sort events
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
          break;
        case 'title':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [events, selectedCategory, searchTerm, sortBy, sortOrder]);

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

        {/* Search and Sort Controls */}
        <div className="mb-6 space-y-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <SortControls 
            sortBy={sortBy} 
            sortOrder={sortOrder} 
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
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
        {filteredAndSortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map(event => (
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