const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const pdfParser = require('../utils/pdfParser');
const geminiHelper = require('../utils/geminiHelper');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload and analyze resume
router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Please log in first' });
        }

        const { targetJobTitle, jobDescription } = req.body;
        const resumePath = req.file.path;

        // Parse PDF
        const resumeText = await pdfParser.parse(resumePath);

        // Analyze with Gemini
        const analysis = await geminiHelper.analyzeResume(resumeText, targetJobTitle, jobDescription);

        // Get job recommendations based on skills
        const jobRecommendations = await geminiHelper.getJobRecommendations(analysis.skills || []);
        
        // Get freelance suggestions
        const freelanceSuggestions = geminiHelper.getFreelanceSuggestions(analysis.skills || []);
        
        // Get open source suggestions
        const openSourceSuggestions = geminiHelper.getOpenSourceSuggestions(analysis.skills || []);

        // Save to database
        const resume = new Resume({
            userId: req.session.userId,
            originalFilename: req.file.originalname,
            parsedContent: {
                text: resumeText,
                skills: analysis.skills || [],
                projects: analysis.projects || [],
                experience: [],
                education: []
            },
            analysis: {
                rating: analysis.rating || 7,
                suggestions: analysis.suggestions || [],
                professionalSummary: analysis.summary || '',
                missingSkills: analysis.missingSkills || [],
                alignmentScore: analysis.alignmentScore || 75
            },
            jobRecommendations,
            freelanceSuggestions,
            openSourceSuggestions
        });

        await resume.save();

        // Clean up uploaded file
        fs.unlinkSync(resumePath);

        res.json({
            success: true,
            resumeId: resume._id,
            analysis: resume.analysis,
            jobRecommendations,
            freelanceSuggestions,
            openSourceSuggestions
        });

    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ error: 'Failed to process resume' });
    }
});

// Get analysis history
router.get('/history', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Please log in first' });
        }

        const resumes = await Resume.find({ userId: req.session.userId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get specific analysis
router.get('/analysis/:id', async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!resume) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
});

module.exports = router;