const express = require("express");
const router = express.Router();
const votingCtrl = require("../controllers/votingCtrl");
const web3Provider = require("../middleware/web3Provider");

router.use(web3Provider);

router.get("/getCand", votingCtrl.getCandidates);
router.post("/addCand", votingCtrl.addCandidate);
router.post("/vote", votingCtrl.vote);

module.exports = router;
