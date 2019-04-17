({fetchPickListVal: function(component, fieldName, elementId) {
       console.log('in init helper..');
    	
       var action = component.get("c.getselectOptions");
       action.setParams({
           "objObject": component.get("v.objInfo"),
           "fld": fieldName
       });
       var opts = [];
       action.setCallback(this, function(response) {
           console.log('in init helper before sucess..');
           if (response.getState() == "SUCCESS") {
               var allValues = response.getReturnValue();
               if (allValues != undefined && allValues.length > 0) {
                   opts.push({
                       class: "optionClass",
                       label: "--- None ---",
                       value: ""
                   });
               }
               for (var i = 0; i < allValues.length; i++) {
                   opts.push({
                       class: "optionClass",
                       label: allValues[i],
                       value: allValues[i]
                   });
               }
               component.find(elementId).set("v.options", opts);
           }
       });
       $A.enqueueAction(action);
   },
	getStatus : function(component,event, helper) {
        console.log('=====getAccounts=====');
        component.set('v.columns', [
            {label: 'Project Name', fieldName: 'Project_Name__c', type: 'Picklist'},
            {label: 'Status Date', fieldName: 'Status_Date__c', type: 'Date/Time'},
            {label: 'subject', fieldName: 'subject__c', type: 'text'},
            {label: 'Description', fieldName: 'Description__c', type: 'text'}
        ]);
        var action = component.get("c.LimitedAccounts");
        action.setParams({
        });
        /*action.setStorable();*/
        action.setCallback(this,function(response) {
            var state = response.getState();
            console.log();
            console.log('Response Time: '+((new Date().getTime())-requestInitiatedTime));
            if (state === "SUCCESS") {
                console.log('Response Time: '+((new Date().getTime())-requestInitiatedTime));
                component.set("v.totalPages", Math.ceil(response.getReturnValue().length/component.get("v.pageSize")));
                component.set("v.data", response.getReturnValue());
                component.set("v.currentPageNumber",1);
                /*helper.buildData(component, helper);*/
            }
        });
        var requestInitiatedTime = new Date().getTime();
        $A.enqueueAction(action);
    },
    
    /*
     * this function will build table data
     * based on current page selection
     * */
    buildData : function(component, helper) {
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.allData");
        var x = (pageNumber-1)*pageSize;
        
        //creating data-table data
        for(; x<=(pageNumber)*pageSize; x++){
            if(allData[x]){
            	data.push(allData[x]);
            }
        }
        component.set("v.data", data);
        
        helper.generatePageList(component, pageNumber);
    },
    
    /*
     * this function generate page list
     * */
    generatePageList : function(component, pageNumber){
        pageNumber = parseInt(pageNumber);
        var pageList = [];
        var totalPages = component.get("v.totalPages");
        if(totalPages > 1){
            if(totalPages <= 10){
                var counter = 2;
                for(; counter < (totalPages); counter++){
                    pageList.push(counter);
                } 
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        component.set("v.pageList", pageList);
    },
  
})