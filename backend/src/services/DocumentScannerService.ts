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
  nameInMalayalam?: string;
  dob?: string;
  gender?: string;
  address?: string;
  state?: string;
  pincode?: string;
  nationality?: string;
  religion?: string;
  caste?: string;
  school?: string;
  board?: string;
  yearOfPassing?: string;
  registerNumber?: string;
  grades?: any;
  fathersName?: string;
  mothersName?: string;
  bloodGroup?: string;
  validity?: string;
  issueDate?: string;
  extraFields?: any;
  isFront?: boolean;
  isBack?: boolean;
  isComplete?: boolean;
  documentType?: string;
  confidence?: string;
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
You will receive a document image.
You must respond in valid JSON only.
No markdown. No explanation. No extra text.

The user has uploaded a document image for the category: "${category}"

Do the following in order:

STEP 1 - IMAGE QUALITY CHECK:
Check if the image is:
- Clear and readable
- Not blurry or dark
- A real physical document (not a screenshot or photocopy of a screen)
If image quality is bad return:
{
  "isValid": false,
  "error": "Image is blurry or not readable. Please upload a clearer photo."
}

STEP 2 - DOCUMENT VALIDATION:
Check if the document matches the category: "${category}"
If it does NOT match return:
{
  "isValid": false,
  "error": "This appears to be a [detected document type]. Please upload a valid ${category}."
}
If the image is not a document at all return:
{
  "isValid": false,
  "error": "This is not a valid document. Please upload your ${category}."
}

STEP 3 - DATA EXTRACTION:
If document is valid, extract all visible data and return:
{
  "isValid": true,
  "documentType": "",
  "confidence": "HIGH or MEDIUM or LOW",
  "data": {
    "name": "",
    "nameInMalayalam": "",
    "dateOfBirth": "",
    "gender": "",
    "documentNumber": "",
    "address": "",
    "state": "",
    "pincode": "",
    "nationality": "",
    "religion": "",
    "caste": "",
    "school": "",
    "board": "",
    "yearOfPassing": "",
    "registerNumber": "",
    "grades": {
      "subjectName": "grade"
    },
    "fathersName": "",
    "mothersName": "",
    "bloodGroup": "",
    "validity": "",
    "issueDate": "",
    "extraFields": {}
  }
}

STRICT RULES:
- Never guess or hallucinate any data
- Only extract what is clearly visible in the image
- If a field is not present set it as null
- For SSLC fill grades object with all subjects
- For Aadhaar extract full address with pincode
- For PAN extract PAN number and fathers name
- For Driving Licence extract DL number and validity date
- For Voter ID extract EPIC number and part number
- For Passport extract passport number and expiry date
- Respond in JSON only`
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
            nameInMalayalam: extracted.nameInMalayalam,
            dob: extracted.dateOfBirth,
            gender: extracted.gender,
            address: extracted.address,
            state: extracted.state,
            pincode: extracted.pincode,
            nationality: extracted.nationality,
            religion: extracted.religion,
            caste: extracted.caste,
            school: extracted.school,
            board: extracted.board,
            yearOfPassing: extracted.yearOfPassing,
            registerNumber: extracted.registerNumber,
            grades: extracted.grades,
            fathersName: extracted.fathersName,
            mothersName: extracted.mothersName,
            bloodGroup: extracted.bloodGroup,
            validity: extracted.validity,
            issueDate: extracted.issueDate,
            extraFields: extracted.extraFields,
            documentType: result.documentType || category,
            confidence: result.confidence,
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
          if (error.message && (error.message.includes('appears to be') || error.message.includes('not a valid document') || error.message.includes('blurry'))) {
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

  async scanAadhaar(imageBuffer: Buffer) {
    return this.scanDocument(imageBuffer, 'Aadhaar');
  }
}
