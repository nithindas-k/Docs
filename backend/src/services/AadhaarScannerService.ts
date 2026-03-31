import sharp from 'sharp';
import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';
import { Buffer } from 'buffer';

export interface AadhaarData {
  aadhaarNumber?: string;
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  isFront?: boolean;
  isBack?: boolean;
  isComplete?: boolean;
  qrParsed?: boolean;
  rawText?: string;
}

export class AadhaarScannerService {
  async scanAadhaar(imageBuffer: Buffer): Promise<AadhaarData> {
    const data: AadhaarData = {
      isFront: false,
      isBack: false,
      isComplete: false,
      qrParsed: false
    };

    try {
      const rawImage = await sharp(imageBuffer)
        .rotate()
        .resize({ width: 1024, withoutEnlargement: true })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      let qrCode = null;
      
      if (rawImage.data.length === rawImage.info.width * rawImage.info.height * 4) {
        qrCode = jsQR(new Uint8ClampedArray(rawImage.data), rawImage.info.width, rawImage.info.height);
      }

      if (!qrCode) {
        try {
          const contrastImg = await sharp(imageBuffer)
            .rotate()
            .resize({ width: 1024, withoutEnlargement: true })
            .grayscale()
            .normalize()
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
          if (contrastImg.data.length === contrastImg.info.width * contrastImg.info.height * 4) {
             qrCode = jsQR(new Uint8ClampedArray(contrastImg.data), contrastImg.info.width, contrastImg.info.height);
          }
        } catch (e) {}
      }

      if (!qrCode) {
        try {
          const sharpImg = await sharp(imageBuffer)
            .rotate()
            .resize({ width: 1024, withoutEnlargement: true })
            .sharpen()
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
          if (sharpImg.data.length === sharpImg.info.width * sharpImg.info.height * 4) {
            qrCode = jsQR(new Uint8ClampedArray(sharpImg.data), sharpImg.info.width, sharpImg.info.height);
          }
        } catch (e) {}
      }

      if (qrCode) {
        data.qrParsed = true;
        this.parseQRData(qrCode.data, data);
      }

      const text = await this.performOCR(imageBuffer);
      data.rawText = text;
      this.extractInfoFromText(text, data);
      this.detectSide(text, data);

      data.isComplete = !!(data.name && data.aadhaarNumber && (data.dob || data.address));

      return data;
    } catch (error) {
      console.error('Error scanning Aadhaar:', error);
      throw new Error('Failed to scan image. Ensure it is a clear image of an Aadhaar card.');
    }
  }

  private parseQRData(qrText: string, result: AadhaarData) {
    if (qrText.includes('<?xml')) {
      const nameMatch = qrText.match(/name="([^"]+)"/);
      const dobMatch = qrText.match(/dob="([^"]+)"/);
      const genderMatch = qrText.match(/gender="([^"]+)"/);
      const uidMatch = qrText.match(/uid="([^"]+)"/);

      if (nameMatch) result.name = nameMatch[1];
      if (dobMatch) result.dob = dobMatch[1];
      if (genderMatch) result.gender = genderMatch[1] === 'M' ? 'MALE' : (genderMatch[1] === 'F' ? 'FEMALE' : genderMatch[1]);
      if (uidMatch) result.aadhaarNumber = uidMatch[1];
    } else {
      try {
        const potentialJson = JSON.parse(qrText);
        if (potentialJson.name) result.name = potentialJson.name;
      } catch (e) {}
    }
  }

  private async performOCR(imageBuffer: Buffer): Promise<string> {
    const processedBuffer = await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .toBuffer();

    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(processedBuffer);
    await worker.terminate();

    return text;
  }

  private extractInfoFromText(text: string, data: AadhaarData) {
    const lines = text.split('\n');
    const normalizedText = text.toUpperCase();

    const allMatches = text.match(/\b\d{4}\s\d{4}\s\d{4}\b|\b\d{12}\b/g) || [];
    const vidMatch = text.match(/VID\s*:\s*(\d{4}\s\d{4}\s\d{4}\s\d{4}|\d{16})/i);
    const vidString = vidMatch ? vidMatch[1].replace(/\s/g, '') : '';

    for (const match of allMatches) {
       const cleanMatch = match.replace(/\s/g, '');
       if (cleanMatch.length === 12 && cleanMatch !== vidString.substring(0, 12)) {
         data.aadhaarNumber = match;
         break;
       }
    }

    const dobMatch = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    if (dobMatch && !data.dob) {
      data.dob = dobMatch[0];
    } else {
      const yearMatch = text.match(/Year of Birth\s*:\s*(\d{4})/i);
      if (yearMatch && !data.dob) data.dob = yearMatch[1];
    }

    if (text.match(/MALE/i)) data.gender = 'MALE';
    else if (text.match(/FEMALE/i)) data.gender = 'FEMALE';

    const dobIndex = lines.findIndex(l => l.toUpperCase().includes('DOB') || l.toUpperCase().includes('YEAR OF BIRTH'));
    const genderIndex = lines.findIndex(l => l.toUpperCase().includes('MALE') || l.toUpperCase().includes('FEMALE'));
    let searchStart = dobIndex !== -1 ? dobIndex : (genderIndex !== -1 ? genderIndex : -1);

    if (searchStart > 0) {
      for (let i = searchStart - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.length > 3 && !line.toUpperCase().includes('GOVERNMENT') && !line.toUpperCase().includes('INDIA') && !line.toUpperCase().includes('AUTHORITY')) {
          data.name = line.replace(/^[S\s&|]+/, '').trim();
          break;
        }
      }
    }

    const addressKeywords = ['Address:', 'S/O', 'D/O', 'W/O', 'HOUSE', 'PO:'];
    for (const keyword of addressKeywords) {
      const idx = normalizedText.indexOf(keyword.toUpperCase());
      if (idx !== -1) {
        let addressBlock = text.substring(idx + keyword.length).trim();
        const addressLines = addressBlock.split('\n');
        const cleanedLines: string[] = [];
        
        for (const line of addressLines) {
           const rawLine = line.trim();
           if (rawLine.length < 3) continue;

           const upperLine = rawLine.toUpperCase();
           if (upperLine.includes('VID :') || upperLine.includes('UNIQUE') || upperLine.includes('HELP@') || upperLine.includes('WWW.')) break;

           let trimmedLine = rawLine
             .replace(/^[|!S#$&|br\sTe/:|]+/, '')
             .replace(/[|!#$&|[\]|]+$/, '')
             .replace(/\b[a-zA-Z]\b[,|.]*/g, '')
             .replace(/\s+/g, ' ')
             .trim();
           
           if (trimmedLine.length < 5 && !trimmedLine.match(/\d{6}/)) continue;
           if (trimmedLine.toUpperCase().includes('ADDRESS')) continue;

           cleanedLines.push(trimmedLine);
           if (trimmedLine.match(/\d{6}\b/)) break;
        }
        
        if (cleanedLines.length > 0) {
           data.address = cleanedLines.join(', ');
        } else {
           data.address = addressBlock.split('\n').filter(l => l.length > 10).slice(0, 3).join(', ');
        }
        break;
      }
    }
  }

  private detectSide(text: string, data: AadhaarData) {
    const normalizedText = text.toUpperCase();
    const frontKeywords = ['DOB:', 'YEAR OF BIRTH', 'MALE', 'FEMALE', 'GOVERNMENT OF INDIA'];
    const frontHits = frontKeywords.filter(k => normalizedText.includes(k)).length;
    const backKeywords = ['ADDRESS:', 'S/O', 'D/O', 'W/O', 'DISTRICT', 'STATE', 'PINCODE', 'PO:', 'HELP@UIDAI.GOV.IN'];
    const backHits = backKeywords.filter(k => normalizedText.includes(k)).length;

    if (frontHits > backHits) {
      data.isFront = true;
    } else if (backHits > 0) {
      data.isBack = true;
    }
  }
}
