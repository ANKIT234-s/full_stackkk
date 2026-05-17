import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Search, Trash2, Edit } from 'lucide-react';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidates(response.data);
    } catch (error) {
      toast.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${id}`);
        toast.success('Candidate deleted successfully');
        fetchCandidates();
      } catch (error) {
        toast.error('Failed to delete candidate');
      }
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <Link to="/candidates/new" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
          Add Candidate
        </Link>
      </div>

      <div className="glass-card p-4 rounded-xl flex items-center">
        <Search className="text-gray-400 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or skills..." 
          className="w-full bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <div key={candidate._id} className="glass-card p-6 rounded-2xl hover-scale flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{candidate.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleDelete(candidate._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors dark:hover:bg-red-900/30">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold mr-2 mb-2">
                  {candidate.experience} Years Exp.
                </span>
              </div>
              
              <div className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 5 && (
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md text-xs font-medium">
                      +{candidate.skills.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredCandidates.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No candidates found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
