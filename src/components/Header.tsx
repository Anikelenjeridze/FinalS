
import { Calendar } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-lg shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Community Events Board
            </h1>
            <p className="text-gray-600 text-sm">
              Stay connected with your neighborhood
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};