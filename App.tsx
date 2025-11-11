
import React from 'react';
import { Dashboard } from './components/Dashboard';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Senior Citizen Crime Analytics</h1>
                <p className="text-sm text-gray-500">Visualizing Trends in India (2016-2022)</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
      </main>
      <footer className="bg-white mt-8 py-4">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Crime Analytics Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
