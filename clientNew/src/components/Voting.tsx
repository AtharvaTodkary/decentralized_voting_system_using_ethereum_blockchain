"use client"
import { useState, useEffect } from 'react';
import { getCandidates, vote } from '../lib/api';

const Voting = () => {
  const [candidates, setCandidates] = useState([]);
  
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await getCandidates();
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const handleVote = async (candidateID: number) => {
    try {
      await vote(candidateID);
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div>
      <h1>Candidates</h1>
      {candidates.map((candidate: any) => (
        <div key={candidate.id}>
          <p>Name: {candidate.name}</p>
          <p>Party: {candidate.party}</p>
          <button onClick={() => handleVote(candidate.id)}>Vote</button>
        </div>
      ))}
    </div>
  );
};

export default Voting;
