import { glob } from 'glob';
import fs from 'fs';

const files = glob.sync('dist/**/*.html');
files.forEach(file => {
  let html = fs.readFileSync(file, 'utf-8');
  // 先去掉尾部已有斜杠，再统一添加，杜绝双斜杠
  html = html.replace(/href="\/([^".#?]+)"/g, (match, p) => {
    const clean = p.replace(/\/+$/, '');
    return `href="/${clean}/"`;
  });
  fs.writeFileSync(file, html, 'utf-8');
});
