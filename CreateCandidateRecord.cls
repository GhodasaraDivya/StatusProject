public class CreateCandidateRecord{
    Public CreateCandidateRecord(){
        todaySatatus();
    }
@AuraEnabled
public static List < String > getselectOptions(sObject objObject, string fld) {
 system.debug('objObject --->' + objObject);
 system.debug('fld --->' + fld);
 List < String > allOpts = new list < String > ();
 
 Schema.sObjectType objType = objObject.getSObjectType();
 Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
 map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
 
 list < Schema.PicklistEntry > values =
  fieldMap.get(fld).getDescribe().getPickListValues();
 
 for (Schema.PicklistEntry a: values) {
  allOpts.add(a.getValue());
 }
 system.debug('allOpts ---->' + allOpts);
 allOpts.sort();
 return allOpts;
}
@AuraEnabled
    public static void createRecord (Status__c candidate){
        
        try{
            System.debug('CreateCandidateRecord::createRecord::candidate'+candidate);
            
            if(candidate != null){
                insert candidate;
            }
            
        } catch (Exception ex){
            
        }
        
    } 
   
  @AuraEnabled
    public static String getFieldSet(String sObjectName, String fieldSetName) {
        String result = '';
        try{
            SObjectType objToken = Schema.getGlobalDescribe().get(sObjectName);
            Schema.DescribeSObjectResult d = objToken.getDescribe();
            Map<String, Schema.FieldSet> FsMap = d.fieldSets.getMap();
            system.debug('>>>>>>> FsMap >>> ' + FsMap);
            if(FsMap.containsKey(fieldSetName))
                for(Schema.FieldSetMember f : FsMap.get(fieldSetName).getFields()) {
                    if(result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + f.getLabel() + '",';
                    jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired()) + '",';
                    jsonPart += '"type":"' + (f.getType()) + '",';
                    jsonPart += '"name":"' + f.getFieldPath() + '"';
                    jsonPart += '}';
                    result += jsonPart;
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        return '['+result+']';
    }

    @AuraEnabled
    public static String getRecords(String sObjectName, String parentFieldName, String parentRecordId, String fieldNameJson){

        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        try{
            List<String> fieldNames = (List<String>) JSON.deserialize(fieldNameJson, List<String>.class);
            Set<String> setFieldNames = new Set<String>();
            String query = 'SELECT ' + String.join(fieldNames, ',') + ' FROM ' + sObjectName;
            if(parentFieldName != NULL && parentFieldName != '' && parentRecordId != NULL){
                query += ' WHERE ' + parentFieldName + '= \'' +  parentRecordId + '\'';
            }
            for(sObject s : Database.query(query)){
                lstResult.add(s);
            }
            if(lstResult.size() > 0) {
                result = JSON.serialize(lstResult);
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        return result;
    }  
     @AuraEnabled
    public static List<Status__c> LimitedAccounts(){
        List<Status__c> accounts = new List<Status__c>();
        accounts =  [SELECT
               Id, Project_Name__c,Status_Date__c, subject__c, Description__c
               FROM Status__c limit 10];
               system.debug('===accounts ==='+accounts);
        return accounts;
    }
    @AuraEnabled
    public static List<Status__c> todaySatatus(){
        List<Status__c> todayList = new List<Status__c>();
        todayList =  [SELECT
               Id, Project_Name__c,Status_Date__c, subject__c, Description__c
               FROM Status__c where CreatedDate = Today];
               system.debug('===accounts ==='+todayList );
        return todayList ;
    }
    @AuraEnabled
    public static List < sObject > fetchLookUpValues(String searchKeyWord, String ObjectName) {
        system.debug('ObjectName-->' + ObjectName);
        String searchKey = searchKeyWord + '%';
        
        List < sObject > returnList = new List < sObject > ();
      
        // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5   
        String sQuery =  'select id, Name from ' +ObjectName + ' where Name LIKE: searchKey order by createdDate DESC limit 5';
        List < sObject > lstOfRecords = Database.query(sQuery);
        
        for (sObject obj: lstOfRecords) {
            returnList.add(obj);
        }
        return returnList;
    }
}