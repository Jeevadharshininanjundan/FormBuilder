const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// Submit response for a form
router.post('/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;
    const response = new Response({ formId, answers });
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get responses for a form
router.get('/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;