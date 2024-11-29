const Web3 = require("web3");
const contract = require("@truffle/contract");
const votingArtifacts = require("../build/contracts/Voting.json");

let web3;
let VotingContract;

const web3Provider = (req, res, next) => {
  if (!web3) {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    VotingContract = contract(votingArtifacts);
    VotingContract.setProvider(web3.currentProvider);
  }
  req.web3 = web3;
  req.VotingContract = VotingContract;
  next();
};

module.exports = web3Provider;
