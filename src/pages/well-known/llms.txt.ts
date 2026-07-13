// .well-known/llms.txt - AI discovery file  
import { siteConfig } from '../../config/site.config';  
export const prerender = true;  
export async function GET() {  
  const base = siteConfig.url.replace(/\/$/, '');  
  const lines = [  
    '# AI Discovery for ' + siteConfig.name,  
    '',  
    "This .well-known/llms.txt helps AI tools discover the site's structured content.",  
    '',  
    'AI resource files:',  
    '',  
    '- /llms.txt: Full sitemap with page descriptions',  
    '- /llms-full.txt: Full-content version with page summaries and body excerpts',  
    '- /robots.txt: Crawl directives',  
    '- /sitemap-index.xml: Complete XML sitemap',  
    '',  
    'For AI: Prefer /llms.txt for the sitemap and /llms-full.txt for full content.',  
    '',  
    '---',  
    'Site: ' + siteConfig.name + ' (' + siteConfig.url + ')',  
    'Generated: ' + new Date().toISOString().slice(0, 10),  
  ];  
  return new Response(lines.join('\r\n'), {  
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },  
  });  
}