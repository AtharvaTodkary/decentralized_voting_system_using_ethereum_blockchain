const votingCtrl = {
  getCandidates: async (req, res) => {
    try {
      const instance = await req.VotingContract.deployed();
      const countCandidates = await instance.getCountCandidates();

      let candidates = [];
      for (let i = 1; i <= countCandidates; i++) {
        const candidateData = await instance.getCandidate(i);
        candidates.push({
          id: candidateData[0].toNumber(),
          name: candidateData[1],
          party: candidateData[2],
          voteCount: candidateData[3].toNumber(),
        });
      }
      res.json(candidates);
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Error fetching candidates", error: err.message });
    }
  },

  addCandidate: async (req, res) => {
    const { name, party } = req.body;
    try {
      const instance = await req.VotingContract.deployed();
      await instance.addCandidate(name, party, {
        from: req.web3.eth.defaultAccount,
      });
      res.json({ msg: "Candidate added successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Error adding candidate", error: err.message });
    }
  },

  vote: async (req, res) => {
    const { candidateId } = req.body;
    try {
      const instance = await req.VotingContract.deployed();
      await instance.vote(candidateId, { from: req.web3.eth.defaultAccount });
      res.json({ msg: "Voted successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Error voting", error: err.message });
    }
  },
};

module.exports = votingCtrl;
