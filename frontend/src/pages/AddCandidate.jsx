import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    bio: '',
    projects: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/candidates', {
        ...formData,
        experience: Number(formData.experience),
        skills
      });
      toast.success('Candidate added successfully!');
      navigate('/candidates');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Candidate</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Enter candidate details and build your talent pool.</p>
      </div>

      <div className="glass-card p-8 rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years of Experience *</label>
            <input 
              type="number" 
              name="experience"
              min="0"
              step="0.1"
              required
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="e.g. 3.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills *</label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="e.g. React, Node.js, MongoDB"
              />
              <button 
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center font-medium"
              >
                <Plus size={20} className="mr-1" /> Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {skills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium flex items-center border border-primary-100 dark:border-primary-800">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500 focus:outline-none">
                    <X size={14} />
                  </button>
                </span>
              ))}
              {skills.length === 0 && <span className="text-sm text-gray-400 py-1.5">No skills added yet.</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio / Summary</label>
            <textarea 
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Brief professional summary..."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                'Save Candidate Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
