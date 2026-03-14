// const axios = require('axios');

// class GeminiHelper {
//     constructor() {
//         this.apiKey = process.env.GEMINI_API_KEY;
//         this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
//     }

//     async analyzeResume(resumeText, targetJobTitle = '', jobDescription = '') {
//         try {
//             const prompt = `
//             Analyze this resume and provide detailed feedback:
            
//             Resume Content:
//             ${resumeText}
            
//             ${targetJobTitle ? `Target Job: ${targetJobTitle}` : ''}
//             ${jobDescription ? `Job Description: ${jobDescription}` : ''}
            
//             Please provide:
//             1. Extract all skills mentioned
//             2. Extract project descriptions
//             3. Rate the resume out of 10 (considering clarity, impact, formatting)
//             4. Provide 5 specific suggestions for improvement
//             5. Generate a professional 2-line summary
//             6. ${jobDescription ? 'Identify missing skills compared to job description' : 'Suggest relevant skills to add'}
//             7. ${targetJobTitle ? 'Calculate alignment score (0-100) with target role' : ''}
            
//             Format the response as JSON with keys: skills, projects, rating, suggestions, summary, missingSkills, alignmentScore
//             `;

//             const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
//                 contents: [{
//                     parts: [{
//                         text: prompt
//                     }]
//                 }]
//             });

//             const analysisText = response.data.candidates[0].content.parts[0].text;
//             // Extract JSON from response
//             const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
//             return jsonMatch ? JSON.parse(jsonMatch[0]) : null;

//         } catch (error) {
//             console.error('Gemini API Error:', error);
//             return this.getFallbackAnalysis();
//         }
//     }

//     getFallbackAnalysis() {
//         return {
//             skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Communication'],
//             projects: ['E-commerce Platform', 'Data Analysis Dashboard'],
//             rating: 7,
//             suggestions: [
//                 'Add quantifiable achievements',
//                 'Include more technical skills',
//                 'Improve project descriptions with metrics',
//                 'Add a professional summary',
//                 'Highlight leadership experiences'
//             ],
//             summary: 'Innovative software developer with 3+ years of experience in full-stack development. Passionate about creating scalable solutions and improving user experiences.',
//             missingSkills: ['DevOps', 'Cloud Computing', 'Machine Learning'],
//             alignmentScore: 75
//         };
//     }

//     async getJobRecommendations(skills) {
//         // In production, this would integrate with job APIs
//         // For now, returning curated job links based on skills
//         const jobDatabase = [
//             {
//                 title: 'Frontend Developer',
//                 company: 'Tech Corp',
//                 location: 'Remote',
//                 link: 'https://www.linkedin.com/jobs/view/12345',
//                 postedDate: new Date(),
//                 requiredSkills: ['React', 'JavaScript', 'CSS']
//             },
//             {
//                 title: 'Full Stack Developer',
//                 company: 'Innovation Labs',
//                 location: 'New York, NY',
//                 link: 'https://www.indeed.com/job/67890',
//                 postedDate: new Date(),
//                 requiredSkills: ['Node.js', 'React', 'MongoDB']
//             },
//             {
//                 title: 'Software Engineering Intern',
//                 company: 'Google',
//                 location: 'Mountain View, CA',
//                 link: 'https://careers.google.com/jobs/54321',
//                 postedDate: new Date(),
//                 requiredSkills: ['JavaScript', 'Python', 'Algorithms']
//             },
//             {
//                 title: 'Backend Developer',
//                 company: 'StartupXYZ',
//                 location: 'Remote',
//                 link: 'https://angel.co/jobs/98765',
//                 postedDate: new Date(),
//                 requiredSkills: ['Python', 'Django', 'PostgreSQL']
//             },
//             {
//                 title: 'Data Science Intern',
//                 company: 'AI Solutions',
//                 location: 'Boston, MA',
//                 link: 'https://www.glassdoor.com/job/24680',
//                 postedDate: new Date(),
//                 requiredSkills: ['Python', 'Machine Learning', 'SQL']
//             }
//         ];

//         // Simple matching algorithm
//         return jobDatabase.map(job => {
//             const matchScore = this.calculateMatchScore(skills, job.requiredSkills);
//             return { ...job, matchScore };
//         }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
//     }

//     calculateMatchScore(userSkills, jobSkills) {
//         if (!userSkills.length || !jobSkills.length) return 50;
//         const matchedSkills = userSkills.filter(skill => 
//             jobSkills.some(jobSkill => 
//                 jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
//                 skill.toLowerCase().includes(jobSkill.toLowerCase())
//             )
//         );
//         return Math.round((matchedSkills.length / jobSkills.length) * 100);
//     }

//     getFreelanceSuggestions(skills) {
//         return [
//             {
//                 platform: 'Upwork',
//                 opportunity: 'Web Development Projects',
//                 link: 'https://www.upwork.com/freelance-jobs/web-development/',
//                 description: 'Find remote web development opportunities'
//             },
//             {
//                 platform: 'Fiverr',
//                 opportunity: 'Programming & Tech',
//                 link: 'https://www.fiverr.com/categories/programming-tech',
//                 description: 'Offer your programming services'
//             },
//             {
//                 platform: 'Toptal',
//                 opportunity: 'Freelance for Top Companies',
//                 link: 'https://www.toptal.com/#hire-top-freelancers-now',
//                 description: 'Join exclusive network of top freelancers'
//             },
//             {
//                 platform: 'Freelancer.com',
//                 opportunity: 'Software Development',
//                 link: 'https://www.freelancer.com/jobs/software-development/',
//                 description: 'Bid on software development projects'
//             }
//         ];
//     }

//     getOpenSourceSuggestions(skills) {
//         const techKeywords = skills.map(s => s.toLowerCase());
        
//         return [
//             {
//                 project: 'First Contributions',
//                 organization: 'Open Source',
//                 link: 'https://github.com/firstcontributions/first-contributions',
//                 technologies: ['Git', 'GitHub'],
//                 description: 'Perfect for beginners to make first open source contribution'
//             },
//             {
//                 project: 'React',
//                 organization: 'Facebook',
//                 link: 'https://github.com/facebook/react/contribute',
//                 technologies: ['React', 'JavaScript'],
//                 description: 'Contribute to popular frontend library'
//             },
//             {
//                 project: 'VS Code',
//                 organization: 'Microsoft',
//                 link: 'https://github.com/microsoft/vscode/contribute',
//                 technologies: ['TypeScript', 'Node.js'],
//                 description: 'Help improve the most popular code editor'
//             },
//             {
//                 project: 'TensorFlow',
//                 organization: 'Google',
//                 link: 'https://github.com/tensorflow/tensorflow/contribute',
//                 technologies: ['Python', 'Machine Learning'],
//                 description: 'Contribute to machine learning framework'
//             },
//             {
//                 project: 'Node.js',
//                 organization: 'OpenJS Foundation',
//                 link: 'https://github.com/nodejs/node/contribute',
//                 technologies: ['JavaScript', 'C++'],
//                 description: 'Contribute to JavaScript runtime'
//             }
//         ].filter(project => 
//             project.technologies.some(tech => 
//                 techKeywords.some(keyword => 
//                     tech.toLowerCase().includes(keyword)
//                 )
//             )
//         ).slice(0, 3);
//     }
// }

// module.exports = new GeminiHelper();



const axios = require('axios');
const jobScraper = require('./jobScraper');

class GeminiHelper {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async analyzeResume(resumeText, targetJobTitle = '', jobDescription = '') {
        try {
            const prompt = `
            Analyze this resume and provide detailed feedback:
            
            Resume Content:
            ${resumeText}
            
            ${targetJobTitle ? `Target Job: ${targetJobTitle}` : ''}
            ${jobDescription ? `Job Description: ${jobDescription}` : ''}
            
            Please provide:
            1. Extract all skills mentioned (technical and soft skills)
            2. Extract project descriptions with technologies used
            3. Rate the resume out of 10 (considering clarity, impact, formatting)
            4. Provide 5 specific suggestions for improvement
            5. Generate a professional 2-line summary
            6. ${jobDescription ? 'Identify missing skills compared to job description' : 'Suggest relevant skills to add based on current market trends'}
            7. ${targetJobTitle ? 'Calculate alignment score (0-100) with target role' : ''}
            8. Suggest job titles that match this profile (top 5)
            
            Format the response as JSON with keys: skills, projects, rating, suggestions, summary, missingSkills, alignmentScore, suggestedJobTitles
            `;

            const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });

            const analysisText = response.data.candidates[0].content.parts[0].text;
            // Extract JSON from response
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            
            // Get top jobs based on skills
            if (analysis && analysis.skills) {
                analysis.topJobs = await jobScraper.getTopJobs(analysis.skills, 10);
            }
            
            return analysis;

        } catch (error) {
            console.error('Gemini API Error:', error);
            return this.getFallbackAnalysis();
        }
    }

    getFallbackAnalysis() {
        return {
            skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Communication', 'Team Leadership', 'Problem Solving'],
            projects: ['E-commerce Platform', 'Data Analysis Dashboard', 'Mobile App Development'],
            rating: 7,
            suggestions: [
                'Add quantifiable achievements (e.g., "Increased sales by 20%")',
                'Include more technical skills like Docker and Kubernetes',
                'Improve project descriptions with metrics and impact',
                'Add a professional summary at the top',
                'Highlight leadership experiences and team collaborations'
            ],
            summary: 'Innovative software developer with 3+ years of experience in full-stack development. Passionate about creating scalable solutions and improving user experiences through clean code and modern technologies.',
            missingSkills: ['DevOps', 'Cloud Computing (AWS)', 'Machine Learning', 'Docker', 'TypeScript'],
            alignmentScore: 75,
            suggestedJobTitles: ['Full Stack Developer', 'Software Engineer', 'Frontend Developer', 'React Developer', 'JavaScript Developer']
        };
    }

    async getFreelanceSuggestions(skills) {
        // Categorized freelance opportunities based on skills
        const allFreelance = [
            {
                platform: 'Upwork',
                opportunities: [
                    { title: 'Web Development Projects', link: 'https://www.upwork.com/freelance-jobs/web-development/', description: 'Find remote web development opportunities', type: 'Development' },
                    { title: 'Mobile App Development', link: 'https://www.upwork.com/freelance-jobs/mobile-development/', description: 'Build iOS and Android apps', type: 'Mobile' }
                ]
            },
            {
                platform: 'Fiverr',
                opportunities: [
                    { title: 'Programming & Tech', link: 'https://www.fiverr.com/categories/programming-tech', description: 'Offer your programming services', type: 'Development' },
                    { title: 'Data Science', link: 'https://www.fiverr.com/categories/data', description: 'Data analysis and visualization', type: 'Data' }
                ]
            },
            {
                platform: 'Toptal',
                opportunities: [
                    { title: 'Freelance for Top Companies', link: 'https://www.toptal.com/#hire-top-freelancers-now', description: 'Join exclusive network of top freelancers', type: 'Premium' }
                ]
            },
            {
                platform: 'Freelancer.com',
                opportunities: [
                    { title: 'Software Development', link: 'https://www.freelancer.com/jobs/software-development/', description: 'Bid on software development projects', type: 'Development' },
                    { title: 'Design & Creative', link: 'https://www.freelancer.com/jobs/design/', description: 'UI/UX and graphic design', type: 'Design' }
                ]
            },
            {
                platform: 'Guru',
                opportunities: [
                    { title: 'Web Development', link: 'https://www.guru.com/d/jobs/web-development/', description: 'Find web development gigs', type: 'Development' }
                ]
            },
            {
                platform: 'PeoplePerHour',
                opportunities: [
                    { title: 'Development & IT', link: 'https://www.peopleperhour.com/freelance-jobs/development-it', description: 'Hourly and project-based work', type: 'Development' }
                ]
            }
        ];

        // Filter opportunities based on skills
        const suggestions = [];
        const skillKeywords = skills.map(s => s.toLowerCase());

        allFreelance.forEach(platform => {
            platform.opportunities.forEach(opp => {
                let relevance = 0;
                if (opp.type.toLowerCase().includes('development') && 
                    skillKeywords.some(k => ['javascript', 'python', 'java', 'react', 'node'].includes(k))) {
                    relevance = 90;
                } else if (opp.type.toLowerCase().includes('data') && 
                          skillKeywords.some(k => ['python', 'sql', 'machine learning', 'data'].includes(k))) {
                    relevance = 85;
                } else if (opp.type.toLowerCase().includes('design') && 
                          skillKeywords.some(k => ['ui', 'ux', 'design', 'figma'].includes(k))) {
                    relevance = 80;
                } else {
                    relevance = 70; // Default relevance
                }

                suggestions.push({
                    platform: platform.platform,
                    title: opp.title,
                    link: opp.link,
                    description: opp.description,
                    relevanceScore: relevance
                });
            });
        });

        return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 6);
    }

    async getOpenSourceSuggestions(skills) {
        const techKeywords = skills.map(s => s.toLowerCase());
        
        // Comprehensive open source project database
        const projects = [
            {
                name: 'First Contributions',
                organization: 'Open Source',
                link: 'https://github.com/firstcontributions/first-contributions',
                technologies: ['Git', 'GitHub'],
                description: 'Perfect for beginners to make first open source contribution',
                difficulty: 'Beginner',
                issues: 'good-first-issues'
            },
            {
                name: 'React',
                organization: 'Facebook',
                link: 'https://github.com/facebook/react/contribute',
                technologies: ['React', 'JavaScript', 'TypeScript'],
                description: 'Contribute to popular frontend library',
                difficulty: 'Intermediate',
                issues: 'https://github.com/facebook/react/issues?q=label%3A%22good+first+issue%22'
            },
            {
                name: 'VS Code',
                organization: 'Microsoft',
                link: 'https://github.com/microsoft/vscode/contribute',
                technologies: ['TypeScript', 'Node.js', 'Electron'],
                description: 'Help improve the most popular code editor',
                difficulty: 'Intermediate',
                issues: 'https://github.com/microsoft/vscode/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            },
            {
                name: 'TensorFlow',
                organization: 'Google',
                link: 'https://github.com/tensorflow/tensorflow/contribute',
                technologies: ['Python', 'Machine Learning', 'C++'],
                description: 'Contribute to machine learning framework',
                difficulty: 'Advanced',
                issues: 'https://github.com/tensorflow/tensorflow/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            },
            {
                name: 'Node.js',
                organization: 'OpenJS Foundation',
                link: 'https://github.com/nodejs/node/contribute',
                technologies: ['JavaScript', 'C++', 'Python'],
                description: 'Contribute to JavaScript runtime',
                difficulty: 'Advanced',
                issues: 'https://github.com/nodejs/node/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            },
            {
                name: 'Flask',
                organization: 'Pallets',
                link: 'https://github.com/pallets/flask',
                technologies: ['Python', 'Web Development'],
                description: 'Contribute to Python web framework',
                difficulty: 'Intermediate',
                issues: 'https://github.com/pallets/flask/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            },
            {
                name: 'Django',
                organization: 'Django Software Foundation',
                link: 'https://github.com/django/django',
                technologies: ['Python', 'Web Development'],
                description: 'Contribute to high-level Python web framework',
                difficulty: 'Intermediate',
                issues: 'https://code.djangoproject.com/query?status=!closed&easy=1'
            },
            {
                name: 'Kubernetes',
                organization: 'CNCF',
                link: 'https://github.com/kubernetes/kubernetes',
                technologies: ['Go', 'DevOps', 'Cloud'],
                description: 'Contribute to container orchestration',
                difficulty: 'Advanced',
                issues: 'https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            },
            {
                name: 'Angular',
                organization: 'Google',
                link: 'https://github.com/angular/angular',
                technologies: ['TypeScript', 'JavaScript', 'Web Development'],
                description: 'Contribute to popular frontend framework',
                difficulty: 'Intermediate',
                issues: 'https://github.com/angular/angular/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            },
            {
                name: 'Vue.js',
                organization: 'Vue.js',
                link: 'https://github.com/vuejs/vue',
                technologies: ['JavaScript', 'TypeScript', 'Web Development'],
                description: 'Contribute to progressive JavaScript framework',
                difficulty: 'Intermediate',
                issues: 'https://github.com/vuejs/vue/issues?q=is%3Aopen+label%3A%22good+first+issue%22'
            }
        ];

        // Score and filter projects based on skills
        const scoredProjects = projects.map(project => {
            let score = 0;
            project.technologies.forEach(tech => {
                if (techKeywords.some(keyword => tech.toLowerCase().includes(keyword))) {
                    score += 25;
                }
            });
            
            // Bonus for beginner-friendly projects
            if (project.difficulty === 'Beginner') score += 30;
            
            return { ...project, matchScore: score };
        });

        return scoredProjects
            .filter(p => p.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);
    }

    async getFreelanceResources() {
        return {
            platforms: [
                { name: 'Upwork', link: 'https://www.upwork.com', tips: 'Create a specialized profile' },
                { name: 'Fiverr', link: 'https://www.fiverr.com', tips: 'Start with competitive pricing' },
                { name: 'Toptal', link: 'https://www.toptal.com', tips: 'For experienced developers only' },
                { name: 'Freelancer.com', link: 'https://www.freelancer.com', tips: 'Bid on multiple projects' }
            ],
            resources: [
                { title: 'Freelance Pricing Guide', link: 'https://www.upwork.com/resources/freelance-hourly-rate', type: 'Guide' },
                { title: 'How to Win Clients', link: 'https://www.fiverr.com/blog', type: 'Blog' },
                { title: 'Freelance Contract Template', link: 'https://www.hellobonsai.com/freelance-contract', type: 'Template' }
            ]
        };
    }
}

module.exports = new GeminiHelper();