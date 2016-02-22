function getDayEnergy()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("day_data");
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
  var solarEdgeUrl = "https://monitoringapi.solaredge.com/site/"+siteId+"/energy.xml?api_key="+apiKey+"&startDate="+startDate+"&endDate="+endDate+"&timeUnit=DAY"
  //Logger.log("SolarEdge URL="+solarEdgeUrl);
  
  //go get some data
  var response = UrlFetchApp.fetch(solarEdgeUrl).getContentText();
  
  //now parse it and get our values
  var artifact = XmlService.parse(response); 
  var days = new Array();
  
    var dateValues = artifact.getRootElement().getChild("values").getChildren("dateValue");
    for(var i = 0; i < dateValues.length; i++)
    if (dateValues[i].getChild("value").getValue() != "null")
    {
      {
        day=[dateValues[i].getChild("date").getValue(),dateValues[i].getChild("value").getValue()]
        days.push(day);
      }
    }
    //Logger.log(days)
    //Logger.log(days.length);
  
  var arrayRange = sheet.getRange("A2:B"+((days.length)+1));
  arrayRange.setValues(days);
  var dateRange = sheet.getRange("A2:A"+((days.length)+1));
  dateRange.setNumberFormat('yyyy-mm-dd');
}
