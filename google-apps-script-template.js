// Google Apps Script Web App Template for Wedding RSVP
// Deploy as Web App: Deploy > New Deployment > Web App > Execute as: Me > Who has access: Anyone


function doPost(e) {
  try {
    // Reject empty requests
    if (!e.parameter) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid request'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get form data from parameters
    const name        = e.parameter.name || '';
    const phone       = e.parameter.phone || '';
    const guests      = e.parameter.guests || '1';
    const message     = e.parameter.message || '';
    const submittedAt = e.parameter.submittedAt || new Date().toISOString();
    
    // Validate required fields
    if (!name || !name.trim()) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false, error: 'Name is required'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false, error: 'Invalid number of guests'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1") || 
                  SpreadsheetApp.getActiveSpreadsheet().insertSheet("Sheet1");
    
    // Set up headers if sheet is new
    if (sheet.getLastRow() === 0) {
      const headers = ['name', 'phone', 'guests', 'message', 'timestamp'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
           .setFontWeight('bold')
           .setBackground('#f3f4f6');
    }

    // Prepare row data
    const rowData = [
      name,          // Column A: name
      phone,         // Column B: phone
      guests,        // Column C: guests
      message,       // Column D: message
      new Date(),    // Column E: timestamp
    ];

    // Append new row
    sheet.appendRow(rowData);
    
    // Format the new row
    const newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1, 1, 5).setFontFamily('Arial').setFontSize(11);

    // Success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'RSVP saved successfully',
      data: {
        name: name,
        timestamp: new Date().toISOString()
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Server error'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'GET method not supported. Please use POST.'
  })).setMimeType(ContentService.MimeType.JSON);
}
