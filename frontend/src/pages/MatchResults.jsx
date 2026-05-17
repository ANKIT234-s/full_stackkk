import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Sparkles, BrainCircuit, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';


const MatchResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [jobReqs, setJobReqs] = useState(null);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');

  useEffect(() => {
    const reqs = localStorage.getItem('jobRequirements');
    if (!reqs) {
      toast.error('No job requirements found. Please set them first.');
      navigate('/requirements');
      return;
    }
    
    const parsedReqs = JSON.parse(reqs);
    setJobReqs(parsedReqs);
    
    // Fetch matched candidates
    const getMatches = async () => {
      try {
        const response = await api.post('/match', parsedReqs);
        setCandidates(response.data);
      } catch (error) {
        toast.error('Failed to run matching algorithm');
      } finally {
        setLoading(false);
      }
    };
    
    getMatches();
  }, [navigate]);

  const handleAIShortlist = async () => {
    if (candidates.length === 0) return;
    
    setAiLoading(true);
    // Send top 5 candidates to AI to save tokens
    const topCandidates = candidates.filter(c => c.matchScore > 0).slice(0, 5);
    
    if (topCandidates.length === 0) {
      toast.error('No qualified candidates to analyze.');
      setAiLoading(false);
      return;
    }

    try {
      const response = await api.post('/match/ai/shortlist', {
        jobRequirements: jobReqs,
        candidates: topCandidates
      });
      setAiRecommendation(response.data.recommendation);
      toast.success('AI Analysis complete!');
    } catch (error) {
      toast.error('AI analysis failed. Check OpenRouter config.');
    } finally {
      setAiLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600 w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Running Matching Algorithm...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/requirements')} className="text-gray-500 hover:text-primary-600 flex items-center text-sm font-medium mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Requirements
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Match Results</h1>
        </div>
        
        <button 
          onClick={handleAIShortlist}
          disabled={aiLoading || candidates.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 dark:shadow-none transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {aiLoading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <Sparkles className="mr-2" size={20} />
          )}
          {aiLoading ? 'AI is analyzing...' : 'Generate AI Shortlist'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidate List Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <CheckCircle2 className="mr-2 text-green-500" size={24} />
            Ranked Candidates ({candidates.length})
          </h2>
          
          <div className="space-y-4">
            {candidates.map((c, idx) => (
              <div key={c._id || idx} className="glass-card p-6 rounded-2xl relative overflow-hidden transition-all hover:shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <span className="text-sm font-mono bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                        {idx + 1}
                      </span>
                      {c.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{c.experience} Years Exp.</p>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl border flex flex-col items-center justify-center ${getScoreColor(c.matchScore)}`}>
                    <span className="text-2xl font-black">{c.matchScore}%</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{c.matchLevel}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {c.skills.map((skill, sIdx) => {
                      const isReq = jobReqs.requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                      const isPref = jobReqs.preferredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                      
                      let skillClass = "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
                      if (isReq) skillClass = "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
                      else if (isPref) skillClass = "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800";

                      return (
                        <span key={sIdx} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${skillClass}`}>
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="glass-card p-12 text-center rounded-2xl">
                <p className="text-gray-500 text-lg">No candidates in the database.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendation Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="glass-card p-6 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
                <BrainCircuit size={120} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6 relative z-10">
                <Sparkles className="mr-2 text-indigo-500" size={24} />
                AI Assistant
              </h2>
              
              <div className="relative z-10 prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300">
                {aiRecommendation ? (
                   // Simple markdown renderer for AI response, or just pre-wrap text if react-markdown not installed
                   <div className="whitespace-pre-wrap leading-relaxed text-sm">
                      {aiRecommendation}
                   </div>
                ) : (
                  <div className="text-center py-12">
                    <BrainCircuit className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Click "Generate AI Shortlist" to get an expert analysis of your top candidates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
