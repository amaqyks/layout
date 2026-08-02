import https from 'https';
import http from 'http';
import { URL } from 'url';

/**
 * Enhanced WeChat Official Account Article Fetcher
 * Features: Full browser headers, SSL/TLS handling, IPv4 fallback, and native HTTPS fallback.
 */
export async function fetchWeChatArticleHtml(targetUrl: string): Promise<string> {
  // Validate URL
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    throw new Error('网址必须以 http:// 或 https:// 开头');
  }

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };

  // Attempt 1: Node native fetch with custom headers
  try {
    const res = await fetch(targetUrl, {
      headers: browserHeaders,
      redirect: 'follow',
    });

    if (res.ok) {
      const html = await res.text();
      if (html && (html.includes('js_content') || html.includes('rich_media_content') || html.includes('<body'))) {
        return html;
      }
    }
  } catch (err) {
    console.warn('Native fetch failed, attempting HTTPS module fallback:', err);
  }

  // Attempt 2: Node native https.get fallback with TLS bypass & redirect follow
  return new Promise<string>((resolve, reject) => {
    function requestUrl(currentUrl: string, redirectCount = 0) {
      if (redirectCount > 5) {
        return reject(new Error('公众号链接重定向次数过多'));
      }

      try {
        const parsedUrl = new URL(currentUrl);
        const reqOptions: https.RequestOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
          path: `${parsedUrl.pathname}${parsedUrl.search}`,
          method: 'GET',
          headers: {
            ...browserHeaders,
            Host: parsedUrl.hostname,
          },
          rejectUnauthorized: false, // Bypass SSL certificate issues
        };

        const client = parsedUrl.protocol === 'https:' ? https : http;

        const req = client.request(reqOptions, (res) => {
          // Handle Redirects (301, 302, 303, 307, 308)
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = new URL(res.headers.location, currentUrl).toString();
            return requestUrl(redirectUrl, redirectCount + 1);
          }

          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            if (data && data.length > 200) {
              resolve(data);
            } else {
              reject(new Error(`未能提取到有效的文章 HTML (HTTP ${res.statusCode})`));
            }
          });
        });

        req.on('error', (e) => {
          reject(new Error(`抓取微信文章失败: ${e.message}`));
        });

        req.end();
      } catch (err: any) {
        reject(new Error(`解析或请求网址异常: ${err.message}`));
      }
    }

    requestUrl(targetUrl);
  });
}
