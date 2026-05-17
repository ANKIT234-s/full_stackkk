const Candidate = require('../models/Candidate');
const axios = require('axios');

// Algorithmic Match
exports.calculateMatch = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;
    const candidates = await Candidate.find();

    const matchedCandidates = candidates.map(candidate => {
      let score = 0;
      let matchLevel = 'Low Match';
      const allRequired = requiredSkills.map(s => s.toLowerCase().trim());
      const allPreferred = preferredSkills ? preferredSkills.map(s => s.toLowerCase().trim()) : [];
      const candidateSkills = candidate.skills.map(s => s.toLowerCase().trim());

      // Experience check
      if (candidate.experience < minExperience) {
        return { ...candidate.toObject(), matchScore: 0, matchLevel: 'Not Qualified (Low Exp)' };
      }

      // Calculate Skill Overlap
      let requiredMatches = 0;
      allRequired.forEach(skill => {
        if (candidateSkills.includes(skill)) requiredMatches++;
      });
      
      let preferredMatches = 0;
      allPreferred.forEach(skill => {
        if (candidateSkills.includes(skill)) preferredMatches++;
      });

      const totalRequiredWeight = allRequired.length * 2;
      const totalPreferredWeight = allPreferred.length * 1;
      const totalWeight = totalRequiredWeight + totalPreferredWeight;

      if (totalWeight > 0) {
        score = ((requiredMatches * 2 + preferredMatches * 1) / totalWeight) * 100;
      } else {
        score = 100; // If no skills required
      }

      score = Math.round(score);

      if (score >= 80) {
        matchLevel = 'High Match';
      } else if (score >= 50) {
        matchLevel = 'Medium Match';
      } else {
        matchLevel = 'Low Match';
      }

      return {
        ...candidate.toObject(),
        matchScore: score,
        matchLevel
      };
    });

    // Sort by score descending
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedCandidates);
  } catch (error) {
    console.error("Error in matching algorithm:", error);
    res.status(500).json({ error: error.message });
  }
};

// AI Shortlist using OpenRouter
exports.aiShortlist = async (req, res) => {
  try {
    const { candidates, jobRequirements } = req.body;
    
    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ error: "No candidates provided" });
    }

    const prompt = `
      You are an expert technical recruiter. Analyze the following job requirements and a list of candidates.
      
      Job Requirements:
      ${JSON.stringify(jobRequirements, null, 2)}
      
      Candidates:
      ${JSON.stringify(candidates.map(c => ({ name: c.name, skills: c.skills, experience: c.experience, bio: c.bio, matchScore: c.matchScore })), null, 2)}
      
      Task:
      1. Analyze the candidate profiles against the job requirements.
      2. Suggest the top candidates.
      3. Explain why each suggested candidate is suitable.
      4. Generate 2-3 interview questions tailored for the top candidates based on their skills and the job requirements.
      
      Please format your response clearly in Markdown.
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o", // using gpt-4o as a widely available high quality model, or similar fallback
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json({ recommendation: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenRouter API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate AI recommendation" });
  }
};
