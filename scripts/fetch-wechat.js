import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const targetUrl = process.argv[2];

if (!targetUrl) {
  console.log('使用说明: node scripts/fetch-wechat.js <微信公众号文章URL>');
  console.log('示例: node scripts/fetch-wechat.js https://mp.weixin.qq.com/s/xxxx');
  process.exit(1);
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781 NetType/WIFI WindowsWechat',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9',
};

function fetchArticle(urlStr) {
  console.log(`正在抓取: ${urlStr}`);
  const parsed = new URL(urlStr);
  const client = parsed.protocol === 'https:' ? https : http;

  const req = client.request({
    hostname: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    path: `${parsed.pathname}${parsed.search}`,
    method: 'GET',
    headers: { ...headers, Host: parsed.hostname },
    rejectUnauthorized: false
  }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const nextUrl = new URL(res.headers.location, urlStr).toString();
      return fetchArticle(nextUrl);
    }

    let body = '';
    res.setEncoding('utf8');
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const outFile = path.join(process.cwd(), 'wechat-extracted.html');
      fs.writeFileSync(outFile, body, 'utf8');
      console.log(`✅ 抓取成功！已将 HTML 源码保存至文件: ${outFile}`);
      console.log(`HTML 大小: ${body.length} 字节`);
    });
  });

  req.on('error', (err) => {
    console.error('❌ 抓取失败:', err.message);
  });

  req.end();
}

fetchArticle(targetUrl);
