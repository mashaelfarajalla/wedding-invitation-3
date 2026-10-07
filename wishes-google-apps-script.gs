/**
 * تخزين مباركات جدار التهاني في Google Sheets
 *
 * طريقة التفعيل:
 * 1. أنشئي Google Sheet جديد.
 * 2. من القائمة: Extensions > Apps Script، واحذفي الكود الموجود والصقي هذا الملف.
 * 3. Deploy > New deployment > النوع: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. انسخي رابط الـ Web app وضعيه في WISHES_API_URL داخل ملف index.html
 *
 * لحذف مباركة غير مناسبة: احذفي صفها من الشيت مباشرة.
 */

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(['date', 'name', 'text']);
  return sheet;
}

function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  const wishes = rows
    .filter(r => r[1] && r[2])
    .map(r => ({ date: Number(r[0]) || 0, name: String(r[1]), text: String(r[2]) }));
  return ContentService.createTextOutput(JSON.stringify(wishes))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const w = JSON.parse(e.postData.contents);
  const name = String(w.name || '').trim().slice(0, 60);
  const text = String(w.text || '').trim().slice(0, 300);
  if (name && text) getSheet_().appendRow([Date.now(), name, text]);
  return ContentService.createTextOutput('ok');
}
