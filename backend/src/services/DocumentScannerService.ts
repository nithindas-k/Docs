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
  gender?: string;
  address?: string;
  isFront?: boolean;
  isBack?: boolean;
  isComplete?: boolean;
  documentType?: string;
  school?: string;
  grades?: any;
  extraFields?: any;
}

export class DocumentScannerService {
  async scanDocument(imageBuffer: Buffer, category: string): Promise<DocumentData> {
    try {
      // 1. Optimize image for Vision API (resize to max 1024px, maintain aspect ratio)
      const processedImage = await sharp(imageBuffer)
        .resize({ width: 1024, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      
      const base64Image = processedImage.toString('base64');

    const visionModels = [
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "llama-3.2-11b-vision-preview" // Fallback but likely decommissioned too
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
                  text: `You are a document verification and data extraction AI. 
Your job is to:
1. Verify if the uploaded image is a valid official document
2. Check if it matches the expected document category
3. Extract structured data from the document
Always respond in valid JSON format only. No extra text.

The user is in the "${category}" section and has uploaded a document image.

Please do the following:

STEP 1 - VALIDATION:
- Check if this image is a real, readable official document
- Check if it matches the category: "${category}"
- If it is NOT a valid document or does NOT match the category, return:
{
  "isValid": false,
  "error": "explain reason here in one line"
}

STEP 2 - EXTRACTION (only if valid):
- Extract all visible information from the document
- Return the following JSON:
{
  "isValid": true,
  "documentType": "",
  "data": {
    "name": "",
    "dateOfBirth": "",
    "gender": "",
    "documentNumber": "",
    "address": "",
    "school": "",
    "grades": {},
    "extraFields": {}
  }
}

Rules:
- If a field is not found, set it as null
- For SSLC, put all subjects and grades inside "grades" object
- For Aadhaar, extract address fully
- For PAN, extract PAN number and father name
- For Driving Licence, extract licence number and validity
- Put any extra fields that don't fit above into "extraFields"
- Never guess or hallucinate data, only extract what is visible
- Respond in JSON only, no markdown, no explanation`
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

        // Map LLM response to our internal DocumentData interface
        const extracted = result.data || {};
        const data: DocumentData = {
          documentId: extracted.documentNumber,
          name: extracted.name,
          dob: extracted.dateOfBirth,
          gender: extracted.gender,
          address: extracted.address,
          school: extracted.school,
          grades: extracted.grades,
          extraFields: extracted.extraFields,
          documentType: result.documentType || category,
          isFront: true,
          isComplete: true
        };

        if (data.documentType?.toUpperCase().includes('AADHAAR')) {
           data.isBack = !!data.address;
           data.isFront = !!data.name;
           data.isComplete = !!(data.name && data.documentId && (data.dob || data.address));
        }

        return data; 
      } catch (error: any) {
        lastError = error;
        // If it's a validation error (not an API error), don't retry, just throw
        if (error.message && (error.message.includes('looks like') || error.message.includes('not a valid'))) {
           throw error;
        }
        console.warn(`Groq Model ${model} failed, trying next in 1s...`, error.message);
        await new Promise(res => setTimeout(res, 1000));
        continue;
      }
    }

    throw new Error(lastError?.message || 'Failed to extract data after multiple retries.');
    } catch (error: any) {
      console.error('Groq Scanning Error:', error);
      throw new Error(error.message || 'Failed to extract data. Please ensure the image is clear.');
    }
  }

  // Alias for backward compatibility (if needed)
  async scanAadhaar(imageBuffer: Buffer) {
    return this.scanDocument(imageBuffer, 'Aadhaar');
  }
}
