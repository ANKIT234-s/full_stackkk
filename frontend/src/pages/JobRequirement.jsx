import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, X, Search } from 'lucide-react';

const JobRequirement = () => {
  const navigate = useNavigate();
  const [minExperience, setMinExperience] = useState('');
  
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState([]);

  const handleAddSkill = (type) => {
    if (type === 'req') {
      if (reqSkillInput.trim() && !requiredSkills.includes(reqSkillInput.trim())) {
        setRequiredSkills([...requiredSkills, reqSkillInput.trim()]);
        setReqSkillInput('');
      }
    } else {
      if (prefSkillInput.trim() && !preferredSkills.includes(prefSkillInput.trim())) {
        setPreferredSkills([...preferredSkills, prefSkillInput.trim()]);
        setPrefSkillInput('');
      }
    }
  };

  const removeSkill = (type, skillToRemove) => {
    if (type === 'req') {
      setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
    } else {
      setPreferredSkills(preferredSkills.filter(s => s !== skillToRemove));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }
    if (!minExperience) {
      toast.error('Please enter minimum experience');
      return;
    }

    // Save job requirements to localStorage (or state manager) to pass to match results
    const jobReqs = {
      requiredSkills,
      preferredSkills,
      minExperience: Number(minExperience)
    };
    
    localStorage.setItem('jobRequirements', JSON.stringify(jobReqs));
    navigate('/match');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Requirements</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Define what you are looking for to match candidates automatically.</p>
      </div>

      <div className="glass-card p-8 rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Required Skills */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">Required Skills *</label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Candidates must have these skills to get a high match score.</p>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={reqSkillInput}
                onChange={(e) => setReqSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('req'))}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. React, Node.js"
              />
              <button 
                type="button"
                onClick={() => handleAddSkill('req')}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {requiredSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center border border-blue-200 dark:border-blue-800">
                  {skill}
                  <button type="button" onClick={() => removeSkill('req', skill)} className="ml-2 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/30">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">Preferred Skills (Optional)</label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Nice-to-have skills that boost the candidate's match score.</p>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={prefSkillInput}
                onChange={(e) => setPrefSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('pref'))}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. TypeScript, AWS"
              />
              <button 
                type="button"
                onClick={() => handleAddSkill('pref')}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {preferredSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium flex items-center border border-purple-200 dark:border-purple-800">
                  {skill}
                  <button type="button" onClick={() => removeSkill('pref', skill)} className="ml-2 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="p-6">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">Minimum Experience (Years) *</label>
            <input 
              type="number" 
              min="0"
              step="0.1"
              required
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              className="w-full md:w-1/3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
              placeholder="e.g. 2"
            />
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button 
              type="submit" 
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-200 dark:shadow-none transition-all flex items-center"
            >
              <Search className="mr-2" size={24} />
              Find Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobRequirement;
