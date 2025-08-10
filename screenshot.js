import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // 페이지 로드
    await page.goto('http://localhost:5175', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // 스크린샷 저장
    const screenshotPath = path.join(
      __dirname,
      'public',
      'images',
      'current_page_screenshot.png'
    );
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`스크린샷이 저장되었습니다: ${screenshotPath}`);
  } catch (error) {
    console.error('스크린샷 생성 중 오류:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
