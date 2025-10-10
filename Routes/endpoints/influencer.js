const express = require('express');
const router = express.Router();
const con = require('../../dbconnect');
const {
  getInfluencers,
  getInfluencerById,
  createInfluencer ,
  updateInfluencer ,
  deleteInfluencer ,
} = require('../../Controllers/Influencer/InfluencerController');



router.use(express.urlencoded({ extended: true }));

// Routes
router.get('/', getInfluencers);
router.get('/:id', getInfluencerById);
router.post('/', createInfluencer);
router.put('/:id', updateInfluencer);
router.delete('/:id', deleteInfluencer);



module.exports = router;