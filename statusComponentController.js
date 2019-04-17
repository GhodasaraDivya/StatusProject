({
 
    fruitsTab: function(component, event, helper) {
        var tab1 = component.find('fruitId');
        var TabOnedata = component.find('fruTabDataId');
 
        var tab2 = component.find('VegeId');
        var TabTwoData = component.find('vegeTabDataId');
 
        var tab3 = component.find('ColorId');
        var TabThreeData = component.find('ColorTabDataId');
        //show and Active fruits tab
        $A.util.addClass(tab1, 'slds-active');
        $A.util.addClass(TabOnedata, 'slds-show');
        $A.util.removeClass(TabOnedata, 'slds-hide');
        // Hide and deactivate others tab
        $A.util.removeClass(tab2, 'slds-active');
        $A.util.removeClass(TabTwoData, 'slds-show');
        $A.util.addClass(TabTwoData, 'slds-hide');
 
        $A.util.removeClass(tab3, 'slds-active');
        $A.util.removeClass(TabThreeData, 'slds-show');
        $A.util.addClass(TabThreeData, 'slds-hide');
    },
    vegeTab: function(component, event, helper) {
 
        var tab1 = component.find('fruitId');
        var TabOnedata = component.find('fruTabDataId');
 
        var tab2 = component.find('VegeId');
        var TabTwoData = component.find('vegeTabDataId');
 
        var tab3 = component.find('ColorId');
        var TabThreeData = component.find('ColorTabDataId');
 
        //show and Active vegetables Tab
        $A.util.addClass(tab2, 'slds-active');
        $A.util.removeClass(TabTwoData, 'slds-hide');
        $A.util.addClass(TabTwoData, 'slds-show');
        // Hide and deactivate others tab
        $A.util.removeClass(tab1, 'slds-active');
        $A.util.removeClass(TabOnedata, 'slds-show');
        $A.util.addClass(TabOnedata, 'slds-hide');
 
        $A.util.removeClass(tab3, 'slds-active');
        $A.util.removeClass(TabThreeData, 'slds-show');
        $A.util.addClass(TabThreeData, 'slds-hide');
 
    },
    colorTab: function(component, event, helper) {
        var tab1 = component.find('fruitId');
        var TabOnedata = component.find('fruTabDataId');
 
        var tab2 = component.find('VegeId');
        var TabTwoData = component.find('vegeTabDataId');
 
        var tab3 = component.find('ColorId');
        var TabThreeData = component.find('ColorTabDataId');
 
        //show and Active color Tab
        $A.util.addClass(tab3, 'slds-active');
        $A.util.addClass(TabThreeData, 'slds-show');
        // Hide and deactivate others tab
        $A.util.removeClass(tab1, 'slds-active');
        $A.util.removeClass(TabOnedata, 'slds-show');
        $A.util.addClass(TabOnedata, 'slds-hide');
 
        $A.util.removeClass(tab2, 'slds-active');
        $A.util.removeClass(TabTwoData, 'slds-show');
        $A.util.addClass(TabTwoData, 'slds-hide');
 
    },
    doInit: function(component, event, helper) {
       console.log('in helper ..');
       helper.fetchPickListVal(component, 'Project_Name__c', 'projectname');
        component.set('v.columns', [
            {label: 'Project Name', fieldName: 'Project_Name__c', type: 'Picklist'},
            {label: 'Status Date', fieldName: 'Status_Date__c', type: 'Date/Time'},
            {label: 'subject', fieldName: 'subject__c', type: 'text'},
            {label: 'Description', fieldName: 'Description__c', type: 'text'}
        ]);
        
		       
        //helper.doInit(component, event, helper);
   },
    
   fetchAcc : function(component, event, helper) {
       var val = event.getSource().get("v.value");
       console.log('====val====='+val);
        	helper.getStatus(component, helper);
       
       
    },
    toDayStatus : function(component, event, helper){
        helper.getToDaysStatus(component,event, helper);
    },
   create : function(component, event, helper) {
		console.log('Create record');
        
        //getting the candidate information
        var candidate = component.get("v.candidate");
        
        //Validation
        if($A.util.isEmpty(candidate.Project_Name__c) || $A.util.isUndefined(candidate.Project_Name__c)){
            alert('Project Name is Required');
            return;
        }            
        if($A.util.isEmpty(candidate.Status_Date__c	) || $A.util.isUndefined(candidate.Status_Date__c	)){
            alert('Date is Rqquired');
            return;
        }
        if($A.util.isEmpty(candidate.subject__c) || $A.util.isUndefined(candidate.subject__c)){
            alert('Subject is Required');
            return;
        }
        if($A.util.isEmpty(candidate.Description__c) || $A.util.isUndefined(candidate.Description__c)){
            alert('Description is Required');
            return;
        }
      
        //Calling the Apex Function
        var action = component.get("c.createRecord");
        
        //Setting the Apex Parameter
        action.setParams({
            candidate : candidate
        });
        
        //Setting the Callback
        action.setCallback(this,function(a){
            //get the response state
            var state = a.getState();
            console.log('===state===='+state);
            //check if result is successfull
            if(state == "SUCCESS"){
                //Reset Form
                var newCandidate = {'sobjectType': 'Status__c',
                                    'Project_Name__c': '',
                                    'Status_Date__c': '',
                                    'subject__c': '', 
                                    'Description__c': ''
                                   };
                //resetting the Values in the form
                component.set("v.candidate",newCandidate);
                alert('Record is Created Successfully');
            } else if(state == "ERROR"){
                alert('Error in calling server side action');
            }
        });
        
		//adds the server-side action to the queue        
        $A.enqueueAction(action);

	},
    onNext : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber+1);
        helper.buildData(component, helper);
    },
    
    onPrev : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber-1);
        helper.buildData(component, helper);
    },
    
    processMe : function(component, event, helper) {
        component.set("v.currentPageNumber", parseInt(event.target.name));

        
    },
    
    onFirst : function(component, event, helper) {        
        component.set("v.currentPageNumber", 1);
        helper.buildData(component, helper);
    },
    
    onLast : function(component, event, helper) {        
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.buildData(component, helper);
    },
    getAllRows : function (component, event) {
        var selectedRows = event.getParam('electedRows')
        component.set('v.selectedRowsCount', selectedRows.length);
	},
    onfocus : function(component,event,helper){
       $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC  
         var getInputkeyWord = '';
         helper.searchHelper(component,event,getInputkeyWord);
    },
    
})