public with sharing class yelpContoller {
    @AuraEnabled(cacheable=true)
    public static String getYelpApi(String street, String city, String state) {
        String locationKey = street + ', ' + city + ', ' + state;
        String query = EncodingUtil.urlEncode(locationKey, 'UTF-8'); 
        String endpoint = 'https://api.yelp.com/v3/businesses/search?location=' + query + '&term=restaurants&radius=16094&sort_by=distance&limit=20';
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setHeader('Authorization','Bearer FBqrdZ-3tAimao2lDfzVO7chAnZ_1JKtc_3Gk_fh0TmzO2LRZIzrtW2E9PIMcxtWcVe3Hz7SSDFDdiCY-fDl25URvsd6ZvPkQtT-4vOnGJ0UCEoGJNms1fpKIMqZY3Yx');
        Http http = new Http();
        HttpResponse res = http.send(req);
        return res.getBody();
    }
    @AuraEnabled(cacheable=true) 
    public static list<Account> getAddress(string idName){
    return [SELECT Id, ShippingStreet, ShippingCity, ShippingState FROM Account where Id=:idName];
 }

}
