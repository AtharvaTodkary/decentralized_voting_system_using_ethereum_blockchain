pragma solidity ^0.5.16; // Change this to 0.5.16

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party; 
        uint voteCount;
    }

    mapping (uint => Candidate) public candidates;
    mapping (address => bool) public voters;

    uint public countCandidates;
    uint256 public votingEnd;
    uint256 public votingStart;

    constructor() public {
        countCandidates = 0;
        votingEnd = 0;
        votingStart = 0;
    }

    function addCandidate(string memory name, string memory party) public returns(uint) {
        countCandidates++;
        candidates[countCandidates] = Candidate(countCandidates, name, party, 0);
        return countCandidates;
    }

    function vote(uint candidateID) public {
        require((votingStart <= block.timestamp) && (votingEnd > block.timestamp), "Voting is not active");
        require(candidateID > 0 && candidateID <= countCandidates, "Invalid candidate ID");
        require(!voters[msg.sender], "You have already voted");

        voters[msg.sender] = true;
        candidates[candidateID].voteCount++;      
    }

    function checkVote() public view returns(bool) {
        return voters[msg.sender];
    }

    function getCountCandidates() public view returns(uint) {
        return countCandidates;
    }

    function getCandidate(uint candidateID) public view returns (uint, string memory, string memory, uint) {
        return (candidateID, candidates[candidateID].name, candidates[candidateID].party, candidates[candidateID].voteCount);
    }

    function setDates(uint256 _startDate, uint256 _endDate) public {
        require((votingEnd == 0) && (votingStart == 0) && (_startDate + 1000000 > block.timestamp) && (_endDate > _startDate), "Invalid dates");
        votingEnd = _endDate;
        votingStart = _startDate;
    }

    function getDates() public view returns (uint256, uint256) {
        return (votingStart, votingEnd);
    }
}