import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import VotingContract from '../contracts/Voting.json';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new web3.eth.Contract(VotingContract.abi as AbiItem[], contractAddress);

export const addCandidate = async (name: string, party: string, account: string) => {
  return await contract.methods.addCandidate(name, party).send({ from: account });
};

export const voteForCandidate = async (candidateID: number, account: string) => {
  return await contract.methods.vote(candidateID).send({ from: account });
};
