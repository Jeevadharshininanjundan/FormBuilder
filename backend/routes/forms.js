
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const streamUpload = require('../utils/streamUpload');
const Form = require('../models/Form');



const validateFormData = (form) => {
    const errors = [];

    if (!form.questions || !Array.isArray(form.questions)) {
        errors.push('Form must contain at least one question.');
        return errors;
    }

    form.questions.forEach((question, index) => {
        if (!question.type) {
            errors.push(`Question ${index + 1} must have a 'type'.`);
            return;
        }

        // Validate Categorize questions
        if (question.type === 'categorize') {
            if (!question.categories || question.categories.length === 0) {
                errors.push(`Question ${index + 1} (Categorize) must have at least one category.`);
            }
            if (!question.options || question.options.length === 0) {
                errors.push(`Question ${index + 1} (Categorize) must have at least one option.`);
            }
            if (!question.optionCategoryMap) {
                errors.push(`Question ${index + 1} (Categorize) is missing the optionCategoryMap.`);
            }
        }

        // Validate Cloze questions (UPDATED LOGIC with more robust regex)
        else if (question.type === 'cloze') {
            
            const blankRegex = /<u[^>]*data-original-text="[^"]*"[^>]*>.*?<\/u>/g;
            const foundBlanks = (question.clozeText.match(blankRegex) || []);

            if (!question.clozeText || foundBlanks.length === 0) {
                errors.push(
                    `Question ${index + 1} (Cloze) must have at least one valid underlined blank (missing data-original-text attribute or the blank itself).`
                );
            }
            // Ensure the number of options matches the number of blanks detected
            if (!question.options || question.options.length !== foundBlanks.length) {
                errors.push(
                    `Question ${index + 1} (Cloze) has a mismatch between the number of blanks (${foundBlanks.length}) and options (${question.options.length}).`
                );
            }
        }

        // Validate Comprehension questions
        else if (question.type === 'comprehension') {
            if (!question.passage || question.passage.trim().length === 0) {
                errors.push(`Question ${index + 1} (Comprehension) must have a passage.`);
            }
            if (!question.passageQuestions || question.passageQuestions.length === 0) {
                errors.push(`Question ${index + 1} (Comprehension) must have at least one MCQ.`);
            }
        }
    });

    return errors;
};


// Create a new form (JSON body)
router.post('/', async (req, res) => {
    try {
        console.log('Received form data:', JSON.stringify(req.body, null, 2));

        // Step 1: Validate the form before saving
        const validationErrors = validateFormData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Step 2: Save to DB only if validation passes
        const form = new Form(req.body);
        await form.save();
        res.status(201).json(form);
    } catch (err) {
        console.error('Error saving form:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ error: 'Form not found' });
        res.json(form);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update form
router.put('/:id', async (req, res) => {
    try {
        const updated = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;