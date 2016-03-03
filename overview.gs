function getOverview() 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //the solar spreadsheet
  var sheetDayData = ss.getSheetByName("day_data"); //day_data sheet with day data
  var sheetDetails = ss.getSheetByName("details"); //details sheet with account information
  var sheetDashboard = ss.getSheetByName("Dashboard"); //dashboard sheet with graphs
  var sheetMonthData = ss.getSheetByName("month_data"); //month_data sheet with month data
  
  //date configs and column/row values.  Used to populate new columns and rows with information
  var time = new Date();
  var year = Number(Utilities.formatDate(time, "EST", "yyyy"));
  var month = Number(Utilities.formatDate(time, "EST", "MM"));
  var day = Number(Utilities.formatDate(time, "EST", "dd"));
  var dayRow = day+1;
  var monthDataColumn = ((year-2015)*1)+1;
  var monthDataRow = ((month)*1)+1;
  //Logger.log("Month="+month+" Year="+year+" Column="+column+" Row="+row);
  
  //solaredge configuration being pulled from details sheet
  var siteId = sheetDetails.getRange("B2").getValue();
  var apiKey = sheetDetails.getRange("B7").getValue();
  var solarEdgeUrl = "https://monitoringapi.solaredge.com/site/"+siteId+"/overview.xml?api_key="+apiKey
  //Logger.log("SolarEdge URL="+solarEdgeUrl);
  
  //go get some data
  var response = UrlFetchApp.fetch(solarEdgeUrl).getContentText();
  //Logger.log(response)
  
  //now parse it and get our values
  var artifact = XmlService.parse(response);
  var root = artifact.getRootElement();
  var lifeTimeData = root.getChild('lifeTimeData').getChild('energy').getText()  //lifetime data
  var lastYearData = root.getChild('lastYearData').getChild('energy').getText();  //current year data
  var lastMonthData = root.getChild('lastMonthData').getChild('energy').getText();  //current month data
  var lastDayData = [day,root.getChild('lastDayData').getChild('energy').getText()];  //current day data
  //Logger.log(lastDayData);
  
  //if it's a new month, then dayRow should equal 2 and we should clear all the cells of prior values
  if (dayRow == "2.0")
  {
    sheetTest.getRange("A2:B32").clearContent()
  }
  
  sheetDashboard.getRange("B1").setValue(root.getChild('lifeTimeData').getChild('energy').getText());  //write lifetime data to dashboard sheet
  sheetDashboard.getRange("D1").setValue(root.getChild('lastYearData').getChild('energy').getText());  //write last year data to dashboard sheet
  sheetMonthData.getRange(1,monthDataColumn).setValue(year);  //write the current year in the column header on month_data sheet
  sheetMonthData.getRange(monthDataRow,monthDataColumn).setValue(lastMonthData);  //write last month data on month_data sheet
  sheetDayData.getRange("A"+dayRow+":"+"B"+dayRow).setValues([lastDayData]);  //write day data on on day_data sheet
}
