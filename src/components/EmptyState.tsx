
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  category: string;
  onCreateEvent: () => void;
}

export const EmptyState = ({ category, onCreateEvent }: EmptyStateProps) => {
  const isFiltered = category !== 'all';
  
  return (
    <div className="text-center py-16">
      <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Calendar className="h-12 w-12 text-blue-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {isFiltered ? `No ${category} Events Found` : 'No Events Yet'}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {isFiltered 
          ? `There are currently no events in the ${category} category. Try selecting a different category or create a new ${category.toLowerCase()} event.`
          : 'Be the first to share what\'s happening in your community! Create an event to get started.'
        }
      </p>
      
      <Button 
        onClick={onCreateEvent}
        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create First Event
      </Button>
    </div>
  );
};