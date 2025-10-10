const express = require('express');
const router = express.Router();
const con = require('../../dbconnect');
const {
  getInfluencer,
  getInfluencerById,
  createInfluencer ,
  updateInfluencer ,
  deleteInfluencer ,
} = require('../../Controllers/InfluencerController');



router.use(express.urlencoded({ extended: true }));

// Routes
router.get('/', getInfluencer);
router.get('/:id', getInfluencerById);
router.post('/', createInfluencer);
router.put('/:id', updateInfluencer);
router.delete('/:id', deleteInfluencer);



module.exports = router;