import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const page = await browser.newPage();

  // HTML 파일 경로 설정
  const htmlPath = path.join(__dirname, 'CCK_Payment_Review_Report.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // HTML 내용을 페이지에 로드
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
  });

  // PDF 생성 옵션
  const pdfOptions = {
    path: path.join(__dirname, 'CCK_Payment_Review_Report.pdf'),
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
            <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-top: 10px;">
                CCK_Payment 프로젝트 종합 리뷰 리포트
            </div>
        `,
    footerTemplate: `
            <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-bottom: 10px;">
                <span class="pageNumber"></span> / <span class="totalPages"></span>
            </div>
        `,
  };

  // PDF 생성
  await page.pdf(pdfOptions);

  console.log('PDF 생성 완료: CCK_Payment_Review_Report.pdf');

  await browser.close();
}

// PDF 생성 실행
generatePDF().catch(console.error);
