@echo off 
 
set "SKIP_PAGEFIND=true"  
 
echo [build] Running astro build (SKIP_PAGEFIND=true)...  
pnpm astro build  
 
echo [build] Running postbuild...  
node scripts/postbuild.js
echo [build] check: /en/ must be absent in dist (zero tolerance)...
node scripts/check-no-en-prefix.mjs
if errorlevel 1 exit /b 1  
 
exit /b 0  
