import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import AddCandidate from './pages/AddCandidate';
import JobRequirement from './pages/JobRequirement';
import MatchResults from './pages/MatchResults';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="candidates" element={<CandidateList />} />
          <Route path="candidates/new" element={<AddCandidate />} />
          <Route path="requirements" element={<JobRequirement />} />
          <Route path="match" element={<MatchResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
