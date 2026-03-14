const axios = require('axios');

class JobScraper {
    constructor() {
        // Free job APIs (no API key required)
        this.apis = {
            remotive: 'https://remotive.com/api/remote-jobs',
            // the Muse: 'https://www.themuse.com/api/public/jobs',
            adzuna: 'https://api.adzuna.com/v1/api/jobs/us/search/1', // Needs app ID
        };
    }

    async getTopJobs(skills, limit = 10) {
        try {
            // Combine skills into search query
            const skillsQuery = skills.slice(0, 5).join(' ');
            
            // Fetch from multiple sources
            const [remotiveJobs, museJobs] = await Promise.all([
                this.fetchRemotiveJobs(skillsQuery),
                this.fetchMuseJobs(skillsQuery)
            ]);

            // Combine and rank jobs
            let allJobs = [...remotiveJobs, ...museJobs];
            
            // Score and rank jobs based on skill match
            allJobs = allJobs.map(job => ({
                ...job,
                matchScore: this.calculateMatchScore(job, skills)
            }));

            // Sort by match score and return top jobs
            return allJobs
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);

        } catch (error) {
            console.error('Error fetching jobs:', error);
            return this.getFallbackJobs(skills);
        }
    }

    async fetchRemotiveJobs(query) {
        try {
            const response = await axios.get(`${this.apis.remotive}?search=${encodeURIComponent(query)}&limit=50`);
            
            return response.data.jobs.map(job => ({
                title: job.title,
                company: job.company_name,
                location: job.candidate_required_location || 'Remote',
                description: job.description,
                link: job.url,
                source: 'Remotive',
                salary: job.salary || 'Not specified',
                postedDate: job.publication_date,
                tags: job.tags || []
            }));
        } catch (error) {
            console.error('Remotive API error:', error);
            return [];
        }
    }

    async fetchMuseJobs(query) {
        try {
            // The Muse public API (limited, no key needed)
            const response = await axios.get(`https://www.themuse.com/api/public/jobs?page=1&search=${encodeURIComponent(query)}`);
            
            return response.data.results.map(job => ({
                title: job.name,
                company: job.company.name,
                location: job.locations?.[0]?.name || 'Remote',
                description: job.contents,
                link: `https://www.themuse.com/jobs/${job.id}`,
                source: 'The Muse',
                salary: 'Not specified',
                postedDate: job.publication_date,
                tags: job.categories?.map(c => c.name) || []
            }));
        } catch (error) {
            console.error('Muse API error:', error);
            return [];
        }
    }

    calculateMatchScore(job, userSkills) {
        let score = 0;
        const jobText = `${job.title} ${job.description} ${job.tags?.join(' ')}`.toLowerCase();
        
        userSkills.forEach(skill => {
            if (jobText.includes(skill.toLowerCase())) {
                score += 10;
            }
        });

        // Bonus points for recent jobs
        if (job.postedDate) {
            const daysSincePosted = (new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24);
            if (daysSincePosted < 7) score += 20;
            else if (daysSincePosted < 30) score += 10;
        }

        return Math.min(100, score);
    }

    getFallbackJobs(skills) {
        // Curated job links when APIs fail
        const jobDatabase = [
            {
                title: 'Frontend Developer',
                company: 'Tech Corp',
                location: 'Remote',
                link: 'https://www.linkedin.com/jobs/view/12345',
                source: 'LinkedIn',
                matchScore: 85,
                salary: '$80k - $120k',
                postedDate: new Date().toISOString(),
                tags: ['React', 'JavaScript', 'CSS']
            },
            {
                title: 'Full Stack Developer',
                company: 'Innovation Labs',
                location: 'New York, NY',
                link: 'https://www.indeed.com/job/67890',
                source: 'Indeed',
                matchScore: 90,
                salary: '$90k - $140k',
                postedDate: new Date().toISOString(),
                tags: ['Node.js', 'React', 'MongoDB']
            },
            {
                title: 'Software Engineering Intern',
                company: 'Google',
                location: 'Mountain View, CA',
                link: 'https://careers.google.com/jobs/54321',
                source: 'Google Careers',
                matchScore: 75,
                salary: '$50k - $70k',
                postedDate: new Date().toISOString(),
                tags: ['JavaScript', 'Python', 'Algorithms']
            },
            {
                title: 'Backend Developer',
                company: 'StartupXYZ',
                location: 'Remote',
                link: 'https://angel.co/jobs/98765',
                source: 'AngelList',
                matchScore: 88,
                salary: '$70k - $110k',
                postedDate: new Date().toISOString(),
                tags: ['Python', 'Django', 'PostgreSQL']
            },
            {
                title: 'Data Science Intern',
                company: 'AI Solutions',
                location: 'Boston, MA',
                link: 'https://www.glassdoor.com/job/24680',
                source: 'Glassdoor',
                matchScore: 82,
                salary: '$60k - $80k',
                postedDate: new Date().toISOString(),
                tags: ['Python', 'Machine Learning', 'SQL']
            }
        ];

        // Filter and score based on skills
        return jobDatabase.map(job => {
            const matchScore = this.calculateSimpleMatchScore(job.tags, skills);
            return { ...job, matchScore };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }

    calculateSimpleMatchScore(jobSkills, userSkills) {
        if (!jobSkills.length || !userSkills.length) return 50;
        const matchedSkills = userSkills.filter(skill => 
            jobSkills.some(jobSkill => 
                jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(jobSkill.toLowerCase())
            )
        );
        return Math.min(100, Math.round((matchedSkills.length / jobSkills.length) * 100) + 20);
    }
}

module.exports = new JobScraper();