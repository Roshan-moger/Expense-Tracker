const express = require('express');
const router = express.Router();
const manualTransactionController = require('../controllers/manualTransactionController');

// GET all manual transactions
router.get('/', manualTransactionController.getManualTransactions);

// POST new manual transaction
router.post('/', manualTransactionController.addManualTransaction);

router.put('/:id', manualTransactionController.updateManualTransactionNote);

router.delete('/:id', manualTransactionController.deleteManualTransaction);
module.exports = router;
