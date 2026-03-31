import sharp from 'sharp';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export interface DocumentData {
  documentId?: string;
  name?: string;
  dob?: string;
  address?: string;
  fields: Array<{ key: string; value: string; isEncrypted: boolean }>;
  documentType?: string;
  confidence?: string;
  isFront?: boolean;
  isBack?: boolean;
  isComplete?: boolean;
}

export class DocumentScannerService {
  async scanDocument(imageBuffer: Buffer, category: string): Promise<DocumentData> {
    try {
      // 1. Optimize image for Vision API
      const processedImage = await sharp(imageBuffer)
        .resize({ width: 1024, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      
      const base64Image = processedImage.toString('base64');

      const visionModels = [
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "llama-3.2-11b-vision-preview"
      ];

      let lastError: any;
      for (const model of visionModels) {
        try {
          const response = await groq.chat.completions.create({
            model: model,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `You are an Indian government document verification and data extraction AI assistant.
You will receive a document image for the vault category: "${category}".

STEP 1: Check image quality. Return error if blurry or unreadable.
STEP 2: Validate if it's a valid ${category}.
STEP 3: EXTRACT ALL INFORMATION as Key-Value pairs EXACTLY AS LABELED ON THE DOCUMENT.

Return ONLY a JSON object:
{
  "isValid": true,
  "documentType": "Official type name (e.g. Aadhaar Card Front)",
  "confidence": "HIGH/MEDIUM/LOW",
  "extractedFields": [
    { "key": "Label on doc (e.g. Name of Candidate)", "value": "Value exactly as printed", "isEncrypted": true },
    ...
  ],
  "documentId": "Primary ID number (Aadhaar/PAN/Register No)",
  "name": "Full name found",
  "error": null
}

RULES:
- Use the actual labels from the document (e.g. 'Name of Father', 'Sex', 'Admission No').
- For SSLC, include all Subjects and Grades as individual fields (e.g. 'English': 'A+').
- Never guess. If field not readable, skip it.
- Respond in single-line valid JSON. NO MARKDOWN.`
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`
                    }
                  }
                ]
              }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
          });

          const responseText = response.choices[0]?.message?.content || '{}';
          const result = JSON.parse(responseText);

          if (result.isValid === false && result.error) {
             throw new Error(result.error);
          }

          const data: DocumentData = {
            documentId: result.documentId,
            name: result.name,
            fields: result.extractedFields || [],
            documentType: result.documentType || category,
            confidence: result.confidence,
            isFront: true,
            isComplete: true
          };

          if (data.documentType?.toUpperCase().includes('AADHAAR')) {
             const hasAddress = data.fields.some(f => f.key.toLowerCase().includes('address'));
             data.isBack = hasAddress;
             data.isFront = !!data.name;
          }

          return data; 
        } catch (error: any) {
          lastError = error;
          if (error.message && (error.message.includes('blurry') || error.message.includes('invalid') || error.message.includes('appears to be'))) {
             throw error;
          }
          console.warn(`Groq failure, retry 1s...`, error.message);
          await new Promise(res => setTimeout(res, 1000));
          continue;
        }
      }

      throw new Error(lastError?.message || 'Extraction failed.');
    } catch (error: any) {
      console.error('Groq Scanning Error:', error);
      throw new Error(error.message || 'Scanning failure.');
    }
  }

  async scanAadhaar(imageBuffer: Buffer) {
    return this.scanDocument(imageBuffer, 'Aadhaar');
  }
}
