function getDailyEnergy()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("daily_data");
  var sheetSiteInfo = ss.getSheetByName("details");

  //date configs and column/row values
  var time = new Date();
  var year = Utilities.formatDate(time, "GMT", "yyyy");
  var month = Utilities.formatDate(time, "GMT", "MM");
  var day = Utilities.formatDate(time, "GMT", "dd");
  var dateColumn = 1;
  var dataColumn = 2;
  var nextInitialRow = sheet.getLastRow() + 1;
  //console.log("Day="+day+", Month="+month+", Year="+year+", dateColumn="+dateColumn+", dataColumn="+dataColumn+", nextInitialRow="+nextInitialRow);
  
  //solaredge configuration
  var startDate = year+"-"+month+"-01";
  //get the total days in the current month
  var endDate = year+"-"+month+"-"+(new Date(year, month, 0).getDate());
  var siteId = sheetSiteInfo.getRange("B2").getValue();
  var apiKey = sheetSiteInfo.getRange("B7").getValue();
  var solarEdgeUrl = "https://monitoringapi.solaredge.com/site/"+siteId+"/energyDetails.xml?api_key="+apiKey+"&startTime="+startDate+"%2011:00:00&endTime="+endDate+"%2011:00:00&timeUnit=DAY";
  //console.log("SolarEdge URL="+solarEdgeUrl);
  
  //go get some data
  var response = UrlFetchApp.fetch(solarEdgeUrl).getContentText();
  
  //now parse it and get our values
  var artifact = XmlService.parse(response); 
  
  var meters = artifact.getRootElement().getChild("meters").getChildren("meterTelemetries");
  
  for (var mi = 0; mi < meters.length; mi++) {
    var meterType = meters[mi].getChild("type").getValue();
    var dataColumn = "B";
    
    switch(meterType) {
      case "Production":
        dataColumn = "B"
        break;
      case "SelfConsumption":
        dataColumn = "C"
        break;
      case "Consumption":
        dataColumn = "D"
        break;
      case "Purchased":
        dataColumn = "E"
        break;
      case "FeedIn":
        dataColumn = "F"
        break;
    }
    
    var meterValues = meters[mi].getChild("values").getChildren("meterTelemetry");
    var nextRow = nextInitialRow;
    var findNextRow = true;

    for (var i = 0; i < meterValues.length; i++) {
      if (meterValues[i].getChild("value") && meterValues[i].getChild("value").getValue() != "null") {
        var dateColumnValues = sheet.getRange('A1:A' + (nextRow + 1)).getValues();
        var found = false;
        
        if (findNextRow) {
          for (var j = 0; j < dateColumnValues.length; j++) {
            if (dateColumnValues[j] == meterValues[i].getChild("date").getValue()) {
              nextRow = j + 1;
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          if (findNextRow) {
            nextRow = sheet.getLastRow() + 1;
            findNextRow = false;
          } else {
            nextRow = nextRow + 1;
          }
        }
        
        sheet.getRange("A" + nextRow).setValue(meterValues[i].getChild("date").getValue());
        sheet.getRange(dataColumn + nextRow).setValue(meterValues[i].getChild("value").getValue());
      }
    }
  }
}
