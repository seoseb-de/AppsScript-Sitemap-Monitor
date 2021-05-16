/*
* check sitemap.xml
* list 200 and non-200 urls
* count and track
*
* based on: Sitemap extractor (Google sheets)
* from: Dave Sottimano @dsottimano Twitter
* https://github.com/dsottimano/xmlsitemap-extractor-google-sheets
*
*/

/**
 * @OnlyCurrentDoc Limits the script to only accessing the current sheet.
 */


function onOpen() {
/**
 * Create a menu-item that allows to check the Sitemap manually
 */

var ui = SpreadsheetApp.getUi();
  ui.createMenu('🔍 Sitemap Check')
    .addItem('⚡ Check Sitemap URLs manually', 'checkSitemapAndLog')
    .addToUi();
}


function checkSitemapAndLog(){
/** 
 * Function sets the basic variables, such as todays date, gets the Sitemap.xml URL from the sheets cell.
 * It calls a function to extract urls from the sitemap and passes them to a function which calls the urls and 
 * returns the HTTP-Status and URL counts.
 * Both are merged into an array which at last is pasted to the last row of the spreadsheets sheet.
 */

  var dateOfCheck = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd');
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet = spreadsheet.getSheetByName('sitemapMonitor');
  var range = sheet.getRange(1,2); 
  var siteMapUrl = range.getValue();

  errorLog = spreadsheet.getSheetByName('errorList');
  errorRange = errorLog.getRange(2,1,errorLog.getLastRow(), errorLog.getLastColumn());
  errorData = [dateOfCheck];

  statsData = [dateOfCheck, siteMapUrl];
  codes = ['count','200er','300er', '400er','500er'];

  locs = extractLocsFromSitemap(siteMapUrl);
  bulkSitemapCheckData = checkUrlsBulk(locs);
  bulkStatuses = bulkStatusCheck(locs, bulkSitemapCheckData);

  for (var i = 0; i < 5; i++ ){
    sheet.appendRow(statsData.concat(codes[i],bulkStatuses[i]));
  }

  // Todo: error URLs to email
  for (var i = 0; i < bulkStatuses[5].length; i++ ){
    errorLog.appendRow(errorData.concat(bulkStatuses[5][i]));
  }

}

function extractLocsFromSitemap(url){
/**
 * Function takes a sitemap.xml-URL as argument, calls the url and tries to extract 
 * the url locations listed in the sitemap-xml file.
 * Returns an array of URLs extracted from the sitemap.xml.
 */

  try {
  
    var xml = UrlFetchApp.fetch(url,{muteHttpExceptions:true});
    var document = XmlService.parse(xml.getContentText());
    var root = document.getRootElement()
    var namespace = root.getNamespace().getURI()
    var sitemapNameSpace = XmlService.getNamespace(namespace);
    let urls = root.getChildren('url',sitemapNameSpace)[0] ? root.getChildren('url', sitemapNameSpace) : root.getChildren('sitemap', sitemapNameSpace);
    var locs = []
    
    for (var i = 0; i < urls.length; i++) {
      locs.push(urls[i].getChild('loc', sitemapNameSpace).getText()) 
    }
    
    Logger.log("successfully extracted " + locs.length + " URLs from " + url )
    return locs  
  } catch (e) {
    console.log(e)
    if (e.toString().includes("The markup in the document preceding the root element must be well-formed")) return "Parsing error: is this a valid XML sitemap?";
    return e.toString() 
  }
}

//  Bulk Check For faster Processing of URLs
 
function checkUrlsBulk(locsFromSitemap){
/**
 * Function takes an array of URLs and creates requests for UrlFetchApp.fetchAll().
 * Each URL is requested.
 * Returns responses of bulk request for all created requests. 
 */

  var testUrls = locsFromSitemap;
  var bulkResponses = [];

  var requests =[];
  var request = {} 
  for (i = 0; i < testUrls.length; i++){
     request =  {
        'url': testUrls[i],
        'followRedirects' : false,
        'muteHttpExceptions':true,
      };
      requests.push(request);
  };

  //Logger.log(requests);
  bulkResponses = UrlFetchApp.fetchAll(requests);
  //Logger.log(testUrls[0] + ' is ' + bulkResponses[0].getResponseCode());
  return bulkResponses;
}

function bulkStatusCheck(locsFromSitemap, bulkResponses){
/**
 * Function takes the URL list and the bulk response object, 
 * the http status codes get extracted and counted depending on their value by 200, 300, 400, 500 steps.
 * URLs not serving HTTP status 200 are added to an array 'errorUrls'.
 * Returns an array containing the count of URLs, the counters of status code types and error URLs.
 * 
 * ToDo: indexability check
 * ToDo: redirect count for redirect chains
 */

  var httpStatusOk = 0;
  var httpStatusRedirect = 0;
  var httpStatusError = 0;
  var httpStatusServerError = 0;
  var countOfUrlsExtracted = bulkResponses.length;
  var errorUrls = [];

  //Logger.log(bulkResponses[0].getHeaders());

  for (var i = 0; i < bulkResponses.length; i++){
    
    urlStatus = bulkResponses[i].getResponseCode();

    if (urlStatus >= 200 && urlStatus <= 299){
      //Logger.log(locsFromSitemap[i] + " is " + urlStatus);
      httpStatusOk++;
    } else if(urlStatus >= 300 && urlStatus <= 399) {
      //Logger.log(locsFromSitemap[i] + " is " + urlStatus);
      errorUrls.push([locsFromSitemap[i], urlStatus]);
      httpStatusRedirect++;
    } else if(urlStatus >= 400 && urlStatus <= 499) {
      //Logger.log(locsFromSitemap[i] + " is " + urlStatus);
      errorUrls.push([locsFromSitemap[i], urlStatus]);
      httpStatusError++;
    } else if(urlStatus >= 500 && urlStatus <= 599) {
      //Logger.log(locsFromSitemap[i] + " is " + urlStatus);
      errorUrls.push([locsFromSitemap[i], urlStatus]);
      httpStatusServerError++;
    } else{
      Logger.log('discovered new status code: ' + urlStatus);
    }
  }
  Logger.log('successfully checked URLs');
  
  //Logger.log(errorUrls);
  return [countOfUrlsExtracted, httpStatusOk, httpStatusRedirect, httpStatusError, httpStatusServerError, errorUrls]
} 
