import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, Briefcase, LayoutDashboard, Sun, Moon, Menu, X } from 'lucide-react';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Add Candidate', path: '/candidates/new', icon: UserPlus },
    { name: 'Job Requirements', path: '/requirements', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">AI Recruiter</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 dark:text-gray-300">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700
      `}>
        <div className="h-full flex flex-col pt-5">
          <div className="hidden md:flex items-center justify-center pb-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-600">
              AI Recruiter
            </h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
