/**
 * خادم محلي لتشغيل تطبيق "منارة" على الهوست والشبكة المحلية (V2.0)
 * Manara Local Host & Hotspot Web Server
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const dns = require('dns');
const net = require('net');
const { exec } = require('child_process');

const APP_DIR = __dirname;
const DEFAULT_PORT = 3000;
const CHECK_INTERVAL_MS = 3000;

// CLI flags
const args = process.argv.slice(2);
const isSilent = args.includes('--silent');
const isForceImmediate = args.includes('--now') || args.includes('--offline');
const isOpenPdf = args.includes('--pdf');

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

// Check internet connection using DNS and TCP Ping
function checkInternet(timeoutMs = 2500) {
  return new Promise((resolve) => {
    dns.resolve('google.com', (err) => {
      if (!err) return resolve(true);

      const socket = new net.Socket();
      let resolved = false;

      const finish = (status) => {
        if (!resolved) {
          resolved = true;
          socket.destroy();
          resolve(status);
        }
      };

      socket.setTimeout(timeoutMs);
      socket.once('connect', () => finish(true));
      socket.once('timeout', () => finish(false));
      socket.once('error', () => finish(false));

      socket.connect(53, '1.1.1.1');
    });
  });
}

// Get non-internal IPv4 addresses (Wi-Fi, Hotspot, Ethernet), filtering out virtual adapters
function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  const virtualRegex = /(virtual|vbox|vmware|vethernet|hyper-v|wsl|loopback)/i;

  for (const name of Object.keys(interfaces)) {
    if (virtualRegex.test(name)) continue;
    for (const netInfo of interfaces[name]) {
      if (netInfo.family === 'IPv4' && !netInfo.internal) {
        addresses.push({ iface: name, ip: netInfo.address });
      }
    }
  }

  // If filtered list is empty, include all non-internal
  if (addresses.length === 0) {
    for (const name of Object.keys(interfaces)) {
      for (const netInfo of interfaces[name]) {
        if (netInfo.family === 'IPv4' && !netInfo.internal) {
          addresses.push({ iface: name, ip: netInfo.address });
        }
      }
    }
  }
  return addresses;
}

// Open URL in default browser
function openBrowser(url) {
  const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                   process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(startCmd, (err) => {
    if (err && !isSilent) {
      console.log(`[!] تعذر فتح المتصفح تلقائياً: ${err.message}`);
    }
  });
}

// Create and start HTTP Server with byte-range and Arabic URI support
function createServer(port) {
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(req.url.split('?')[0]);
    } catch {
      decodedUrl = req.url.split('?')[0];
    }

    let filePath = path.join(APP_DIR, decodedUrl === '/' ? 'index.html' : decodedUrl);

    // Prevent path traversal
    if (!filePath.startsWith(APP_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('ممنوع الوصول');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err) {
        // Fallback for SPA routing
        if (!path.extname(decodedUrl) || decodedUrl.startsWith('/#')) {
          const fallbackPath = path.join(APP_DIR, 'index.html');
          fs.readFile(fallbackPath, (err2, data) => {
            if (err2) {
              res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
              res.end('الملف غير موجود');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
          });
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('الملف غير موجود: ' + decodedUrl);
        return;
      }

      if (stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const range = req.headers.range;

      // Handle Range requests (essential for fast PDF and media streaming)
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

        if (start >= stats.size) {
          res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
          res.end();
          return;
        }

        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': stats.size,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': ['.html', '.js', '.webmanifest'].includes(ext) ? 'no-cache' : 'public, max-age=31536000'
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (!isSilent) console.log(`[!] المنفذ ${port} مشغول، جاري تجربة المنفذ ${port + 1}...`);
      createServer(port + 1);
    } else {
      if (!isSilent) console.error(`[!] خطأ في السيرفر:`, err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    const localUrl = `http://localhost:${port}`;
    const netAddrs = getNetworkAddresses();
    const pdfUrl = `${localUrl}/كتاب_المدخل_إلى_اللغة_العربية.pdf`;

    if (!isSilent) {
      console.log('\n' + '='.repeat(68));
      console.log('       🚀  تم تشغيل تطبيق "منارة" على الهوست والشبكة المحلية (V2.0)');
      console.log('='.repeat(68));
      console.log('  📌 إحصائيات المحتوى الجاهز : 241 درساً  |  792 سؤال قياس واختبار');
      console.log('  📚 المتون المفعلة حالياً  : المدخل للعربية · بانت سعاد · الأربعون النووية');
      console.log('                            المنظومة البيقونية (بشرح ابن عثيمين) · عمدة الأحكام');
      console.log('  📄 كتاب المقرر المدمج     : كتاب_المدخل_إلى_اللغة_العربية.pdf (جاهز)');
      console.log('-'.repeat(68));
      console.log(`\n  💻 [1] رابط الجهاز الحالي (Localhost):\n      👉  ${localUrl}\n`);

      if (netAddrs.length > 0) {
        console.log('  📱 [2] رابط الهوت سبوت / الواي فاي للأجهزة الأخرى (Hotspot / Mobile):');
        for (const item of netAddrs) {
          console.log(`      👉  http://${item.ip}:${port}   [كرت: ${item.iface}]`);
        }
        console.log('\n  💡 ملاحظة: يمكن فتح الرابط أعلاه من أي هاتف أو جهاز متصل بنفس الشبكة!');
      }

      console.log('-'.repeat(68));
      console.log(`  📖 [3] رابط كتاب المدخل (PDF) المباشر:\n      👉  ${pdfUrl}`);
      console.log('\n' + '='.repeat(68));
      console.log('  اضغط [Ctrl + C] لإيقاف السيرفر في أي وقت.');
      console.log('='.repeat(68) + '\n');
    }

    if (isOpenPdf) {
      openBrowser(pdfUrl);
    } else {
      openBrowser(localUrl);
    }
  });
}

// Main execution flow
async function main() {
  if (!isSilent) {
    console.log('='.repeat(68));
    console.log('       منارة — تشغيل تطبيق طلب العلم الشرعي على الهوست (V2.0)');
    console.log('='.repeat(68));
  }

  if (isForceImmediate) {
    if (!isSilent) console.log('[⚡] بدء التشغيل المباشر دون انتظار فحص الإنترنت (وضع أوفلاين)...');
    createServer(DEFAULT_PORT);
    return;
  }

  if (!isSilent) process.stdout.write('🔍 جاري فحص الاتصال بالإنترنت');

  let isOnline = await checkInternet();
  if (isOnline) {
    if (!isSilent) console.log('\n[✓] تم التحقق: الجهاز متصل بالإنترنت بنجاح!');
    createServer(DEFAULT_PORT);
    return;
  }

  if (!isSilent) {
    console.log('\n[!] الجهاز غير متصل بالإنترنت حالياً.');
    console.log('[⏳] في انتظار توفر اتصال بالإنترنت لبدء تشغيل التطبيق على الهوست...');
  }

  const timer = setInterval(async () => {
    if (!isSilent) process.stdout.write('.');
    const onlineNow = await checkInternet();
    if (onlineNow) {
      clearInterval(timer);
      if (!isSilent) {
        console.log('\n[✓] تم التقاط الاتصال بالإنترنت بنجاح!');
        console.log('[🚀] جاري بدء تشغيل السيرفر وفتح المتصفح...');
      }
      createServer(DEFAULT_PORT);
    }
  }, CHECK_INTERVAL_MS);
}

main();
