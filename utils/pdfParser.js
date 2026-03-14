const pdf = require('pdf-parse');
const fs = require('fs');

class PDFParser {
    async parse(resumePath) {
        try {
            const dataBuffer = fs.readFileSync(resumePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('PDF parsing error:', error);
            throw new Error('Failed to parse PDF file');
        }
    }
}

module.exports = new PDFParser();