SyncedCron.add({
  name: 'Commision Report',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('on the first day of the month at 3:00 am');
   //return parser.text('every 1 minute');
  },
  job: function() {
    console.log('Running Commission report...');


     var d = new Date();
     var endDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-01';
     d.setMonth(d.getMonth() - 1);
     var startDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-01';
     var reportDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);



      Meteor.call('wtPowercodeGetServicesSoldBySalesPersonAll', startDate, endDate, function (err, res) {
      var curSalesPerson;
      var curCommissionTypeId;
      var mRes; // for db results
      var rowCount = res.length;
      var workingData = [];
      var workingIndex = 0;
      var balances = {};

      // Get commission rates and convert into quickly accessable format
      var services = {};
      mRes = WtPowercodeCommission.collection.service.find().fetch();
      var len = mRes.length;
      for (var i = 0; i < len; i++) {

        var serId = mRes[i].serviceId;
        services[serId] = {};

        var lenInner = mRes[i].commissions.length;
        for (var ii = 0; ii < lenInner; ii++) {
          var commission = {};
          commission.amount = mRes[i].commissions[ii].amount;
          commission.type = mRes[i].commissions[ii].type;
          services[serId][mRes[i].commissions[ii].typeId] = commission;
        }

      }

      for (var i = 0; i < rowCount; i++) {

        // Update the user commission group as it changes.
        if (curSalesPerson != res[i].SalesPerson) {
          curSalesPerson = res[i].SalesPerson;
          mRes = WtPowercodeCommission.collection.user.findOne({'webUsername': curSalesPerson});
          if (! mRes) {
            curCommissionTypeId = null;
          } else {
            curCommissionTypeId = mRes.commissionTypeId;
          }
        }


        // Do we have a commission to give?
        if (! services[res[i].ServiceID] ) { continue; }
        if (! services[res[i].ServiceID][curCommissionTypeId] ) { continue; }
        if (Number(services[res[i].ServiceID][curCommissionTypeId].amount) == 0) { continue; }

        if (! balances[res[i].CustomerID]) balances[res[i].CustomerID] = {};
        if (! balances[res[i].CustomerID][res[i].Date]) balances[res[i].CustomerID][res[i].Date] = [];
              balances[res[i].CustomerID][res[i].Date].push(workingIndex);
        res[i].isPaidUp = "UNK";
        if (services[res[i].ServiceID][curCommissionTypeId].type == '%') {
          res[i].commission = numeral(Number(res[i].Amount) * (Number(services[res[i].ServiceID][curCommissionTypeId].amount) / 100.00)).format('$0,0.00');"createdAt" 
        } else {
          res[i].commission = numeral(Number(services[res[i].ServiceID][curCommissionTypeId].amount)).format('$0,0.00');
        }
        res[i].Amount = numeral(res[i].Amount).format('$0,0.00');

        workingData.push(res[i]);
        workingIndex++;
      }

   
      _.each(balances, function(dates, customerId) {
        _.each(dates, function(indexs, date) {
         Meteor.call('wtPowercodePaidUpBalance', customerId, date, function (err, res) {
            if (err) return;
            var paid;
	    if (Number(res[0].balance) <= 0) {
              paid = "Yes";
            } else {
              paid = "No";
            }
           var len = indexs.length;
            for (var i = 0; i < len; i++) {
              workingData[indexs[i]].isPaidUp = paid;
            }
          
          }); 
        });
      });
for (var i = 0; i < workingData.length; i++) {
 WtPowercodeCommission.collection.report.insert(workingData[i]);
}     
   
    });
 

            
  }
});

SyncedCron.start();
