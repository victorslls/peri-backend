const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = (data, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);
    doc.fontSize(16).text('Laudo Pericial', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(data.content);
    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

module.exports = generatePDF;