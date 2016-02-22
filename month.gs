function getMonthlyEnergy()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("month_data");
  var sheetSiteInfo = ss.getSheetByName("details");
  
  //date configs and column/row values
  var time = new Date();
  var year = Utilities.formatDate(time, "GMT", "yyyy");
  var month = Utilities.formatDate(time, "GMT", "MM");
  var column = ((year-2015)*1)+1;
  var row = ((month)*1)+1;
  //Logger.log("Month="+month+" Year="+year+" Column="+column+" Row="+row);
  
  //solaredge configuration
  var startDate = year+"-"+month+"-01";
  //get the total days in the current month
  var endDate = year+"-"+month+"-"+(new Date(year, month, 0).getDate());
  var siteId = sheetSiteInfo.getRange("B2").getValue();
  var apiKey = sheetSiteInfo.getRange("B7").getValue();
  var solarEdgeUrl = "https://monitoringapi.solaredge.com/site/"+siteId+"/energy.xml?api_key="+apiKey+"&startDate="+startDate+"&endDate="+endDate+"&timeUnit=MONTH"
  //Logger.log("SolarEdge URL="+solarEdgeUrl);
  
  //go get some data
  var response = UrlFetchApp.fetch(solarEdgeUrl).getContentText();
  //Logger.log(response)
  
  //now parse it and get our values
  var artifact = XmlService.parse(response);
  var root = artifact.getRootElement();
  var value = root.getChild('values').getChild('dateValue').getChild('value').getText();
  //Logger.log("artifact="+artifact+" root="+root+" value="+value)
  
  //write it out and when we are in a new year, add a year heading
  sheet.getRange(1,column).setValue(year);
  sheet.getRange(row,column).setValue(value);
}
