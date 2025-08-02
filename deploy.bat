@echo off
echo Deploying to Lolipop...

REM Git操作
git add .
git commit -m "Update: %date% %time%"
git push origin main

echo Deploy started via GitHub Actions
echo Check: https://github.com/marky808/legament-website/actions

pause
