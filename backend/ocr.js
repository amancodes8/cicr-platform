// ocr.js

const Tesseract = require('tesseract.js');
const { fromPath } = require('pdf2pic');
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname, 'i2.png'); // Your file

// --- OCR for images ---
async function ocrImage(imagePath) {
    const { data: { text } } = await Tesseract.recognize(
        imagePath,
        'eng',
        { logger: m => console.log(m) }
    );
    return text;
}

// --- OCR for PDF pages ---
async function ocrPDF(pdfPath) {
    // First, try to extract text directly
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    if (data.text && data.text.trim()) {
        console.log("[PDF text extracted directly]");
        return data.text;
    }

    // Fallback to OCR if no text found
    console.log("[No embedded text found. Using OCR...]");

    const outputDir = path.resolve(__dirname, 'temp_images');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const options = {
        density: 300,       // higher DPI for better OCR
        saveFilename: "page",
        savePath: outputDir,
        format: "png",
        width: 1800
    };

    const storeAsImage = fromPath(pdfPath, options);
    let finalText = "";
    let page = 1;

    while (true) {
        try {
            const pageData = await storeAsImage(page);
            console.log(`OCRing page ${page}...`);
            const text = await ocrImage(pageData.path);
            finalText += text + "\n";
            fs.unlinkSync(pageData.path);
            page++;
        } catch (err) {
            break; // no more pages
        }
    }

    fs.rmSync(outputDir, { recursive: true, force: true });

    if (!finalText.trim()) finalText = "[No text detected]";
    return finalText;
}

// --- Main ---
(async () => {
    const ext = path.extname(filePath).toLowerCase();
    let resultText = "";

    try {
        if (ext === '.pdf') {
            resultText = await ocrPDF(filePath);
        } else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            resultText = await ocrImage(filePath);
        } else if (ext === '.txt') {
            resultText = fs.readFileSync(filePath, 'utf-8');
        } else {
            throw new Error("Unsupported file type. Allowed: pdf, png, jpg, jpeg, txt");
        }

        console.log("\n--- OCR Result ---\n");
        console.log(resultText);
    } catch (err) {
        console.error("Error:", err);
    }
})();
