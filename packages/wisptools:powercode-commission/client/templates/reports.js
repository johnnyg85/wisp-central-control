
//var Future = Npm.require('fibers/future');

Template.wtPowercodeCommissionReports.created = function () {
  var self = this;
  self.reportData = new ReactiveVar([]);
  self.running = new ReactiveVar(false);
  self.percentDone = new ReactiveVar(0);
 
   
}

Template.wtPowercodeCommissionReports.rendered=function() {
  //  $('#commStartDate').datepicker();
  //  $('#commEndDate').datepicker();
}

Template.wtPowercodeCommissionReports.helpers({
  reportData: function () {
    return Template.instance().reportData.get();
  },
  running: function () {
    return Template.instance().running.get();
  },
  disabled: function () {
    return Template.instance().running.get() ? 'disabled' : '';
  },
  haveData: function () {
    return Template.instance().reportData.get().length === 0 ? true : false;
  },
    percentDone: function () {
    return Template.instance().percentDone.get();
  }
});



Template.wtPowercodeCommissionReports.events({
  "submit .run-comm-report": function (event) {
    event.preventDefault();
    event.stopPropagation();
    
    var given = event.target.commStartDate.value;
    var self = Template.instance();
    if(given!="None")
    {
    given=given.split(" ");
    switch(given[1])
    {
        case 'Jan' : given[1]="01";
        break;
        case 'Feb' : given[1]="02";
        break;
        case 'Mar' : given[1]="03";
        break;
        case 'Apr' : given[1]="04";
        break;
        case 'May' : given[1]="05";
        break;
        case 'Jun' : given[1]="06";
        break;
        case 'Jul' : given[1]="07";
        break;
        case 'Aug' : given[1]="08";
        break;
        case 'Sep' : given[1]="09";
        break;
        case 'Oct' : given[1]="10";
        break;
        case 'Nov' : given[1]="11";
        break;
        case 'Dec' : given[1]="12";
        break;
    }  
    given[2]="01";
    given=given.join("-");
    var end=given.split("-");
    end[2]="31";
    end=end.join("-");
    
    self.running.set(true);
    self.percentDone.set(35);
    var workingData=  WtPowercodeCommission.collection.report.find({"Date" : {$gte :given,$lt:end},"isPaidUp":"Yes"});
    self.reportData.set(workingData);
    self.running.set(false);
 }
else
{
workingData=[];
self.reportData.set(workingData);
    self.running.set(false);
} 

 }
});




Template.wtPowercodeCommissionReportSelect.helpers({

  typeList: function () {
	var reportDates=[];
        var rdate;
        var temp;
        var k=0;
        var r=0;
        
        var myArray= WtPowercodeCommission.collection.report.find({},{sort:{Date:1}}).fetch();
        var distinctArray= _.unique(myArray, false, function(d) {return d.Date});
	var distinctvalues=_.pluck(distinctArray,'Date');
	for(var i=0;i<distinctvalues.length;i++)
        {
            temp=distinctvalues[i].split("-");
            temp.pop();
            switch(temp[1])
            {
                case '01' : temp[1]="Jan";
                break;
                case '02' : temp[1]="Feb";
                break;
                case '03' : temp[1]="Mar";
                break;
                case '04' : temp[1]="Apr";
                break;
                case '05' : temp[1]="May";
                break;
                case '06' : temp[1]="Jun";
                break;
                case '07' : temp[1]="Jul";
                break;
                case '08' : temp[1]="Aug";
                break;
                case '09' : temp[1]="Sep";
                break;
                case '10' : temp[1]="Oct";
                break;
                case '11' : temp[1]="Nov";
                break;
                case '12' : temp[1]="Dec";
                break;
            }
        rdate=temp.join(" ");
        if(i==0)
        {
            reportDates[k]=temp.join(" ");
            continue;
        }
        else
        {
            k=reportDates.length;
            while(r<=k)
            {   
             if(reportDates[r]==rdate)
              {	
                break;
              }
            if(r==k)
            {
                reportDates[r]=rdate;
                break;
            }
            r++;
            }       
        }
  
        }

     return reportDates;

  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});
