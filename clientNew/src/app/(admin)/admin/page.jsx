"use client"
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import VotingArtifact from '../../contracts/Voting.json';
// import styles from '../styles/AdminPortal.module.css';

const AdminPortal = () => {
  const [account, setAccount] = useState('');
  const [votingContract, setVotingContract] = useState(null);
  const [countCandidates, setCountCandidates] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  useEffect(() => {
    const loadWeb3AndData = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          // const networkId = await web3.eth.net.getId();
          // const deployedNetwork = VotingArtifact.networks;

          // if (!deployedNetwork) {
          //   console.error('Smart contract not deployed on the current network.');
          //   setMessage('Please switch to the correct Ethereum network.');
          //   return;
          // }

          // const instance = new web3.eth.Contract(
          //   VotingArtifact.abi,
          //   deployedNetwork && deployedNetwork.address
          // );
          const manualAddress = '0x7B497aaA94dB0c709b2F35539e43378614617D4F'; 
          const instance = new web3.eth.Contract(VotingArtifact.abi, manualAddress);

          setVotingContract(instance);
          loadCandidates(instance);
          checkIfVoted(instance);
          loadDates(instance);
        } catch (error) {
          console.error('Error connecting to Metamask:', error);
        }
      } else {
        alert('Please install Metamask!');
      }
    };

    loadWeb3AndData();
  }, []);

  const loadCandidates = async (contract) => {
    const count = await contract.methods.getCountCandidates().call();
    setCountCandidates(Number(count));

    const candidatesData = [];
    for (let i = 1; i <= count; i++) {
      const candidate = await contract.methods.getCandidate(i).call();
      candidatesData.push({
        id: Number(candidate[0]), // Ensure candidate ID is a number
        name: candidate[1],
        party: candidate[2],
        votes: candidate[3],
      });
    }
    setCandidates(candidatesData);
  };

  const loadDates = async (contract) => {
    const dates = await contract.methods.getDates().call();
    const start = new Date(dates[0] * 1000).toLocaleDateString();
    const end = new Date(dates[1] * 1000).toLocaleDateString();
    setStartDate(start);
    setEndDate(end);
  };

  const checkIfVoted = async (contract) => {
    const voted = await contract.methods.checkVote().call();
    setHasVoted(voted);
  };

  const handleAddCandidate = async () => {
    if (votingContract && candidateName && candidateParty) {
      try {
        await votingContract.methods.addCandidate(candidateName, candidateParty).send({ from: account });
        setMessage('Candidate added successfully!');
        setCandidateName(''); // Clear the input fields
        setCandidateParty('');
        loadCandidates(votingContract); // Reload candidate list after adding
      } catch (error) {
        console.error('Error adding candidate:', error);
        setMessage('Failed to add candidate.');
      }
    } else {
      setMessage('Please provide both candidate name and party.');
    }
  };

  const handleSetDates = async () => {
    const start = Math.floor(Date.parse(startDate) / 1000);
    const end = Math.floor(Date.parse(endDate) / 1000);
    if (votingContract && startDate && endDate) {
      try {
        await votingContract.methods.setDates(start, end).send({ from: account });
        setMessage('Dates defined successfully!');
        loadDates(votingContract);
      } catch (error) {
        console.error('Error setting dates:', error);
        setMessage('Failed to define dates.');
      }
    } else {
      setMessage('Please select both start and end dates.');
    }
  };

  const handleVote = async () => {
    if (!selectedCandidateId) {
      setMessage('Please vote for a candidate.');
      return;
    }

    try {
      await votingContract.methods.vote(parseInt(selectedCandidateId)).send({ from: account });
      setMessage('Voted successfully!');
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
      setMessage('Failed to vote.');
    }
  };


  return (
    <div>
      <h1>Decentralized Voting Using Ethereum Blockchain</h1>
      <div>
        <h3>Your Account: {account}</h3>
        <div>
          <legend>Add Candidate</legend>
          <input
            type="text"
            placeholder="Candidate's name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Candidate's party"
            value={candidateParty}
            onChange={(e) => setCandidateParty(e.target.value)}
          />
          <button onClick={handleAddCandidate}>Add Candidate</button>
        </div>

        <div>
          <legend>Define Voting Dates</legend>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleSetDates}>Define Dates</button>
        </div>

        <div>
          <legend>Voting Period: {startDate} - {endDate}</legend>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Party</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.id}
                      onChange={() => setSelectedCandidateId(candidate.id)}
                      disabled={hasVoted}
                    />
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.party}</td>
                  <td>{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleVote} disabled={hasVoted}>
            Vote
          </button>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );

};

export default AdminPortal;
