# Notifications Setup

The website uses the same Google Spreadsheet configured by `HIGH_LEVEL_SCHEDULE_SHEET_ID` in `Code.gs`.

Create a tab named `Notifications` with these columns:

Title | Message | Date | Link | Active | Display Order

Only rows with Active = Yes/True/1 are shown. The website reads them through the Apps Script endpoint `?action=notifications`.

After updating Code.gs in Google Apps Script, deploy a new web-app version and keep the web-app URL in `config.js`.
