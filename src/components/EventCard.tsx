import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Event } from '../pages/Index';
import { QRCodeGenerator } from './QRCodeGenerator';
import { analyticsService } from '../services/analyticsService';
import { useEffect } from 'react';

interface EventCardProps {
  event: Event;
  distance?: string | null;
}

export const EventCard = ({ event, distance }: EventCardProps) => {
  // Track views when component mounts
  useEffect(() => {
    analyticsService.updateEventViews(event.id, event.title, event.category);
  }, [event.id, event.title, event.category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Social: 'bg-pink-100 text-pink-800 border-pink-200',
      Education: 'bg-blue-100 text-blue-800 border-blue-200',
      Sports: 'bg-green-100 text-green-800 border-green-200',
      Arts: 'bg-purple-100 text-purple-800 border-purple-200',
      Other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Category Badge and Distance */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          {distance && (
            <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full text-xs font-medium">
              {distance}
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2 text-green-500" />
            <span>{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-red-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <User className="h-4 w-4 mr-2 text-purple-500" />
            <span className="line-clamp-1">{event.organizer}</span>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* QR Code and Sharing */}
        <QRCodeGenerator event={event} />
      </div>

      {/* Card Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-3 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
          Learn More
        </button>
      </div>
    </div>
  );
};
