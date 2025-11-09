const express = require('express');
const router = express.Router();
const con = require('../../dbconnect');
const {
  getCampaigns,
  getCampaignById,
  createCampaign ,
  updateCampaign ,
  deleteCampaign ,
} = require('../../Controllers/Campaign/CampaignController');



router.use(express.urlencoded({ extended: true }));

// Routes
router.get('/getall', getCampaigns);
router.get('/getcampaign/:id', getCampaignById);
router.post('/create', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/delete:id', deleteCampaign);



module.exports = router;