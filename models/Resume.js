const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalFilename: String,
    parsedContent: {
        text: String,
        skills: [String],
        projects: [String],
        experience: [String],
        education: [String]
    },
    analysis: {
        rating: Number,
        suggestions: [String],
        professionalSummary: String,
        missingSkills: [String],
        alignmentScore: Number
    },
    jobRecommendations: [{
        title: String,
        company: String,
        location: String,
        link: String,
        postedDate: Date,
        matchScore: Number
    }],
    freelanceSuggestions: [{
        platform: String,
        opportunity: String,
        link: String,
        description: String
    }],
    openSourceSuggestions: [{
        project: String,
        organization: String,
        link: String,
        technologies: [String]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', resumeSchema);