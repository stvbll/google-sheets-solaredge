function getDetails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("details")
  
  //solaredge configuration
  var siteId = sheet.getRange("B2").getValue();
  var apiKey = sheet.getRange("B7").getValue();
  var solarEdgeUrl = "https://monitoringapi.solaredge.com/site/"+siteId+"/details.xml?"+"api_key="+apiKey
  var invUrl = "https://monitoringapi.solaredge.com/equipment/"+siteId+"/list.xml?"+"api_key="+apiKey
  //Logger.log("SolarEdge URL="+solarEdgeUrl);
  
  //go get some data
  var response = UrlFetchApp.fetch(solarEdgeUrl).getContentText();
  var response2 = UrlFetchApp.fetch(invUrl).getContentText();
  
  //now parse it and get our values
  var artifact = XmlService.parse(response);
  var artifact2 = XmlService.parse(response2);
  var root = artifact.getRootElement();
  var root2 = artifact2.getRootElement();
  
  //write it out
  sheet.getRange(1,2).setValue(root.getChild('name').getText());
  sheet.getRange(3,2).setValue(root.getChild('accountId').getText());
  sheet.getRange(4,2).setValue(root.getChild('status').getText());
  sheet.getRange(5,2).setValue(root.getChild('lastUpdateTime').getText());
  sheet.getRange(10,2).setValue(root.getChild('peakPower').getText());
  sheet.getRange(11,2).setValue(root.getChild('primaryModule').getChild('manufacturerName').getText());
  sheet.getRange(12,2).setValue(root.getChild('primaryModule').getChild('modelName').getText());
  sheet.getRange(13,2).setValue(root.getChild('primaryModule').getChild('maximumPower').getText());
  sheet.getRange(8,2).setValue(root2.getChild('list').getChild('serialNumber').getText());
}
