const express = require('express');
const router = express.Router();
const con = require('../../dbconnect');
const {
  getWallets,
  getWalletById,
  createWallet ,
  updateWallet ,
  deleteWallet ,
} = require('../../Controllers/WalletController');



router.use(express.urlencoded({ extended: true }));

// Routes
router.get('/', getWallets);
router.get('/:id', getWalletById);
router.post('/', createWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);



module.exports = router;