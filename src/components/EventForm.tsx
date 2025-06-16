
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event } from '../pages/Index';

interface EventFormProps {
  onSubmit: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const EventForm = ({ onSubmit, onClose }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    organizer: ''
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: '',
        organizer: ''
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Event</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">Share your event with the community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Event Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter event title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`mt-1 ${errors.date ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-semibold text-gray-700">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`mt-1 ${errors.time ? 'border-red-500' : ''}`}
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
              Location *
            </Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Enter event location"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Category and Organizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={`mt-1 ${errors.category ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="organizer" className="text-sm font-semibold text-gray-700">
                Organizer *
              </Label>
              <Input
                id="organizer"
                type="text"
                value={formData.organizer}
                onChange={(e) => handleInputChange('organizer', e.target.value)}
                className={`mt-1 ${errors.organizer ? 'border-red-500' : ''}`}
                placeholder="Your name or organization"
              />
              {errors.organizer && <p className="text-red-500 text-xs mt-1">{errors.organizer}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`mt-1 min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe your event..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold"
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};