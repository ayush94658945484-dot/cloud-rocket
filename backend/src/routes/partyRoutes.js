const express = require('express');
const router = express.Router();
const {
  createPartyRoom,
  getPartyRoom,
  addItemToPartyRoom
} = require('../controllers/partyController');

router.post('/create', createPartyRoom);
router.get('/:id', getPartyRoom);
router.post('/:id/add-item', addItemToPartyRoom);

module.exports = router;
