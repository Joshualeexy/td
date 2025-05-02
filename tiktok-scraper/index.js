const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/likers', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) return res.status(400).json({ error: 'Missing video URL' });

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(videoUrl, { waitUntil: 'networkidle2',timeout: 60000,
         });

        // TODO: customize selector based on TikTok DOM
        const likers = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a[href*="/@"]'));
            return Array.from(new Set(
                anchors.map(a => {
                    const match = a.href.match(/\/@([a-zA-Z0-9_.]+)/);
                    return match ? match[1] : null;
                }).filter(Boolean)
            ));
        });

        await browser.close();
        res.json({ likers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Scraping failed' });
    }
});

app.listen(3001, () => console.log('Scraper API running on port 3001'));
