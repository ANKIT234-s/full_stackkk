import { Link } from 'react-router-dom';
import { Users, Briefcase, Zap, UserPlus } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="glass-card p-6 rounded-2xl hover-scale">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Candidates</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Manage Database</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl hover-scale">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Zap size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Shortlisting</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Powered by OpenRouter</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl flex flex-col items-start justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Candidates</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Build your talent pool by adding detailed candidate profiles including their skills, experience, and bio.</p>
          <Link to="/candidates/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
            Add New Candidate
          </Link>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col items-start justify-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
            <Briefcase size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Start Matching</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Enter your job requirements and let our algorithm and AI find the perfect match from your candidate pool.</p>
          <Link to="/requirements" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-teal-200 dark:shadow-none">
            Create Job Requirement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
