const express = require('express');
const router = express.Router();
const con = require('../../dbconnect');
const {
  getCampaigns,
  getCampaignById,
  createCampaign ,
  updateCampaign ,
  deleteCampaign ,
} = require('../../Controllers/CampaignController');



router.use(express.urlencoded({ extended: true }));

// Routes
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
module.exports = router;


module.exports = router;