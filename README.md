#Google Sheets SolarEdge
A collection of Google Sheets scripts for interacting with the **SolarEdge** API

* SolarEdge Monitoring Portal Login: [https://monitoring.solaredge.com/solaredge-web/p/login](https://monitoring.solaredge.com/solaredge-web/p/login)
* SolarEdge API Reference Doc: [www.solaredge.com/files/pdfs/se_monitoring_api.pdf](www.solaredge.com/files/pdfs/se_monitoring_api.pdf)
* [Example Google Sheets Spreadsheet](https://docs.google.com/spreadsheets/d/14_s_zoSnMXNBf8O9BEUB90QZbYsosLDAK6piDL_C9yM/edit?usp=sharing)

##About
This project's goal is to leverage the **SolarEdge** API using **Google Scripts** to pull data into a **Google Sheets** spreadsheet.  Once in the spreadsheet, you can choose to do whatever you'd like with the data.  Using **Google Sheets Triggers**, you can trigger a series of scripts to execute at an interval you define.  For example, during a particular time of day, once a day, once a week, on load, etc.

If your utility provider also provides an API, you can combine the information from your SolarEdge inverter with that from your utility provider.

![Dashboard](https://drive.google.com/uc?id=0B67YKsDXbXJ0SEptc0FES0lLMjA)

###Requirements
You need to have the following to use this code
1. SolarEdge private API Key
2. Site ID
3. Inverter Serial Number (_only if you want to pull inverter data_)
 
You can request a private API key from SolarEdge or your Solar installer on behalf of SolarEdge.  You should have your Site ID as well, but you can get that and your inverter's serial number from the SolarEdge monitoring site.

###Script Files
There are four script files that you can use.  You can choose to combine them as they are separate for each function but redundant in code in many places between them.
* **month.gs** - Fetches the total kWh for the current month (no longer used, but available if you want to use it)
* **day.gs** - Fetches the total kWh for each day of the current month (no longer used, but available if you want to use it)
* **details.gs** - Fetches site specific information like panel type and peak power information
* **inverter.gs** - Fetches the kW and temperature from the inverter for the given day
* **overview.gs** - Fetches total kWh for lifetime, year, month, and day (replaces **month.gs** and **day.gs**)
 
###Script File References
Each script has some hard-coding in it that you can change at will
* Names of sheets are hardcoded in lines similar to
  `var sheetSiteInfo = ss.getSheetByName("details");`
* Location lookups for **API Key**, **Site ID**, and **Inverter Serial**
  `var apiKey = sheetSiteInfo.getRange("B7").getValue();`

##Usage
1. Open a spreadsheet in Google Sheets
2. Create five sheets **month_data**, **day_data**, **inverter_data**, **details**, and **Dashboard** (_if you want a dashboard page for charts and graphs_)
3. On the **details** sheet, enter your **API Key** into **B7**
4. On the **details** sheet, enter your **Site ID** into **B2**
5. On the **details** sheet, enter your *Inverter Serial* into **B8**

<img src="https://drive.google.com/uc?id=0B67YKsDXbXJ0QjBoMnJsTEV6LWs" width="150">

6. Click **Tools** > **Script Editor***
7. Create three scripts **overview.gs**, **inverter.gs**, and **details.gs**
8. Paste the code from this repository into the corresponding _example.gs_ sheet script like **monthly.gs**
9. Click **Resources** > **....Triggers** in the **Script Editor** and set the frequency you'd like each to be triggered

**Note** that there is a limit on the number of calls you can make in a day as a best practice.  Please be a mindful consumer :)
