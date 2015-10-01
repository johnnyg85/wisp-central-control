var Future = Npm.require('fibers/future');

var runQuery = function (sql, future) {
  // Get connection from pool
  WtPowercode.pool.getConnection(function(err, connection) {
    if (err) { throw new Meteor.Error(err); }
    // Run query
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { throw new Meteor.Error(err); }
      // return results
      future.return(results);
    });
  });  
}

Meteor.methods({
  wtPowercodeGetAllWebUsers: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var db_name = Meteor.settings.powercode.dbName;
    var sql = 
      "SELECT  " +
      "  w.WebUserID, " +
      "  w.Username,  " +
      "  w.AccessLevel,  " +
      "  w.BadPass,  " +
      "  w.Name,  " +
      "  a.Address1, " +
      "  a.Address2, " +
      "  a.City, " +
      "  a.State, " +
      "  a.ZipCode, " +
      "  p.Number, " +
      "  e.Email  " +
      "FROM  " +
      "  " + db_name + ".WebUser w " +
      "  LEFT JOIN " + db_name + ".Email e ON w.EmailID=e.ID " +
      "  LEFT JOIN " + db_name + ".Phone p ON w.PhoneID=p.ID " +
      "  LEFT JOIN " + db_name + ".Address a ON w.AddressID=a.AddressID " +
      "ORDER BY w.Username ";

    runQuery(sql, fut);

    return fut.wait();
  }
});

var getServicesSQL = function (type) {
  var where = "";
  var db_name = Meteor.settings.powercode.dbName;
  if (type == "Monthly Services") {
    where = "WHERE Type IN ('Monthly','Monthly Internet')";
  }
  return "SELECT ID, Cost, Type, Tax, Status, Discription as Description, CONCAT('$', FORMAT(Cost, 2)) as CostFormat FROM " + db_name + ".Services " + where + " ORDER BY Type, Description";
}

Meteor.methods({
  wtPowercodeGetAllServices: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var sql = getServicesSQL(null);
    runQuery(sql, fut);

    return fut.wait();
  },
  wtPowercodeGetAllMonthlyServices: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var sql = getServicesSQL("Monthly Services");
    runQuery(sql, fut);

    return fut.wait();
  }
});


Meteor.methods({
  wtPowercodeGetAllInvProducts: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var db_name = Meteor.settings.powercode.dbName;
    var sql = "SELECT * FROM " + db_name + ".InvProduct ORDER BY Model, Name";
    runQuery(sql, fut);

    return fut.wait();
  }
});

Meteor.methods({
  wtPowercodeGetAccountingSum: function(customerId, debCred, date) {
    if (Meteor.userId() == null) return null;

    var table = "Debits";
    if (debCred == "Credits") table = "Credits";

    var date;
    if (! date) {
      date = new Date();
    } else {
      date = new Date(date);
    }
    date.setDate(date.getDate()+1); // set to beginning of the next day

    var fut = new Future();
    var db_name = Meteor.settings.powercode.dbName;
    var sql = "SELECT sum(Amount) as AccountSum FROM " + db_name + "." + table + " WHERE CustomerID=" + customerId + " AND Time < '" + WtDateFormat(date, 'isoDate') + "'";
    runQuery(sql, fut);

    return fut.wait();
  }
});


Meteor.methods({
  wtPowercodeGetServicesSoldBySalesPersonAll: function(startDate, endDate) {
   if (Meteor.userId() == null && this.connection != null) return null;

      startDate = new Date(startDate);
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate()+1);

   // var startDateFormat = WtDateFormat(startDate, 'isoDate');
  //  var endDateFormat = WtDateFormat(endDate, 'isoDate');

    var fut = new Future();
    var db_name = Meteor.settings.powercode.dbName;
    var sql = "SELECT " +
                "c.CustomerID, " +
                "c.FirstName, " +
                "c.LastName,  " +
                "c.CompanyName, " +
                "d.Amount, " +
                "d.Discription as Description, " +
                "DATE_FORMAT(d.Time, '%Y-%m-%d') as Date, " +
                "d.ServiceID, " +
                "csp.Username as SalesPerson " +
              "FROM " +
                db_name + ".Debits d, " +
                db_name + ".CustomerSalesPerson csp, " +
                db_name + ".Customer c " +
              "WHERE " +
                "d.CustomerID=c.CustomerID AND " +
                "csp.CustomerID=d.CustomerID AND " +
                "d.TaxTypeID IS NULL AND " +
                "d.Time > '" + WtDateFormat(startDate, 'isoDate') + "' AND " +
                "d.Time < '" + WtDateFormat(endDate, 'isoDate') + "' " +
              "ORDER BY " +
                "csp.Username, c.CustomerID, d.Time";
     runQuery(sql, fut);

    return fut.wait();
  }
});

Meteor.methods({
  wtPowercodePaidUpBalance: function(customerId, date) {
    if (Meteor.userId() == null && this.connection != null) return null;

    var date;
    if (! date) {
      date = new Date();
    } else {
      date = new Date(date);
    }
    date.setDate(date.getDate()+1); // set to beginning of the next day

    var fut = new Future();
    var db_name = Meteor.settings.powercode.dbName;
    var sql = "SELECT d.sum - c.sum as balance from (SELECT sum(Amount) as sum FROM " + db_name + ".Debits WHERE CustomerID=" + customerId + " AND Time <= '" + WtDateFormat(date, 'isoDate') + "') d, (SELECT sum(Amount) as sum FROM " + db_name + ".Credits WHERE CustomerID=" + customerId + ") c";
    runQuery(sql, fut);

    return fut.wait();
  }
});

/********************************
/* Tax Report
/*************/
Meteor.methods({
  wtPowercodeGetTaxReport: function(startDate, endDate) {
    // this.connection is null when the server makes the call
    // check if we have an authorized user or if the server made the call
    if (Meteor.userId() == null && this.connection != null) return null;

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate()+1);

    var startDateFormat = WtDateFormat(startDate, 'isoDate');
    var endDateFormat = WtDateFormat(endDate, 'isoDate');

    var serviceIds = '(75, 77)'; // Services that are really taxes
    var paymentClass = '(5, 6, 7, 8, 9)';  // The account classes that are type payment

    var getTaxSql = function(debOrCrd) {

      var debitLine = 'format(sum(dc.Amount), 2) as Debit, ';
      var creditLine = '\'0.00\' as Credit, ';

      if (debOrCrd == 'Credits') {
        debitLine = '\'0.00\' as Debit, ';
        creditLine = 'format(sum(dc.Amount), 2) as Credit, ';
      }

      return 'SELECT ' + 
          'concat(cust.CustomerID, \'-\', date_format(dc.Time, \'%Y-%m-%d\')) as InvoiceNumber, ' +
          'cust.CustomerID, ' +
          'date_format(dc.Time, \'%Y-%m-%d\') as Date, ' +
          'cust.FirstName, ' +
          'cust.LastName, ' +
          'cust.CompanyName, ' +
          'a.Address1, ' +
          'a.City, ' +
          'a.State, ' +
          'substr(a.ZipCode, 1, 5) as Zip, ' +
          'dc.Discription as InvoiceDescription, ' +
          't.Name as Description, ' +
          'sum(cs.Quanity) as ServiceQuantity, ' +
          'ac.Discription as AccountClass, ' +
          debitLine +
          creditLine +
          '\'Collected Tax\' as Type ' +
        'FROM ' + 
          dbName + '.Customer cust, ' +
          dbName + '.Address a, ' + 
          dbName + '.' + debOrCrd + ' dc, ' +
          dbName + '.TaxType t, ' +
          dbName + '.AccountClass ac, ' +
          dbName + '.CustomerServices cs ' +
        'WHERE ' +
          'cust.CustomerID=dc.CustomerID AND ' +
          'cust.CustomerID=a.CustomerID AND ' +
          'cust.CustomerID=cs.CustomerID AND ' +
          'dc.ServiceID=cs.ServiceID AND ' +
          'a.Type=\'Home\' AND ' +
          'dc.Time >= \'' + startDateFormat + '\' AND ' + 
          'dc.Time < \'' + endDateFormat + '\' AND ' +
          'dc.TaxTypeID = t.ID AND ' +
          'dc.AccountClassID = ac.ID AND ' +
          'dc.AccountClassID NOT IN ' + paymentClass + ' ' +
        'GROUP BY CustomerID, InvoiceDescription, AccountClass, Date ' +
        'ORDER BY Date, CustomerID ';

    }


    var getTaxServiceSql = function(debOrCrd) {

      var debitLine = 'format(sum(dc.Amount), 2) as Debit, ';
      var creditLine = '\'0.00\' as Credit, ';

      if (debOrCrd == 'Credits') {
        debitLine = '\'0.00\' as Debit, ';
        creditLine = 'format(sum(dc.Amount), 2) as Credit, ';
      }

      return 'SELECT ' + 
          'concat(cust.CustomerID, \'-\', date_format(dc.Time, \'%Y-%m-%d\')) as InvoiceNumber, ' +
          'cust.CustomerID, ' +
          'date_format(dc.Time, \'%Y-%m-%d\') as Date, ' +
          'cust.FirstName, ' +
          'cust.LastName, ' +
          'cust.CompanyName, ' +
          'a.Address1, ' +
          'a.City, ' +
          'a.State, ' +
          'substr(a.ZipCode, 1, 5) as Zip, ' +
          'dc.Discription as InvoiceDescription, ' +
          's.Discription as Description, ' +
          'sum(cs.Quanity) as ServiceQuantity, ' +
          'ac.Discription as AccountClass, ' +
          debitLine +
          creditLine +
          '\'Collected Tax\' as Type ' +
        'FROM ' + 
          dbName + '.Customer cust, ' +
          dbName + '.Address a, ' + 
          dbName + '.' + debOrCrd + ' dc, ' +
          dbName + '.AccountClass ac, ' +
          dbName + '.Services s, ' +
          dbName + '.CustomerServices cs ' +
        'WHERE ' +
          'cust.CustomerID=dc.CustomerID AND ' +
          'cust.CustomerID=a.CustomerID AND ' +
          'cust.CustomerID=cs.CustomerID AND ' +
          'dc.ServiceID=cs.ServiceID AND ' +
          'a.Type=\'Home\' AND ' +
          'dc.Time >= \'' + startDateFormat + '\' AND ' + 
          'dc.Time < \'' + endDateFormat + '\' AND ' +
          'dc.ServiceID = s.ID AND ' +
          'dc.AccountClassID = ac.ID AND ' +
          's.ID IN ' + serviceIds + ' AND ' +
          'dc.AccountClassID NOT IN ' + paymentClass + ' ' +
        'GROUP BY CustomerID, InvoiceDescription, AccountClass, Date ' +
        'ORDER BY Date, CustomerID ';

    }

    var getServiceSql = function(debOrCrd) {

      var debitLine = 'format(sum(dc.Amount), 2) as Debit, ';
      var creditLine = '\'0.00\' as Credit, ';

      if (debOrCrd == 'Credits') {
        debitLine = '\'0.00\' as Debit, ';
        creditLine = 'format(sum(dc.Amount), 2) as Credit, ';
      }

      return 'SELECT ' + 
          'concat(cust.CustomerID, \'-\', date_format(dc.Time, \'%Y-%m-%d\')) as InvoiceNumber, ' +
          'cust.CustomerID, ' +
          'date_format(dc.Time, \'%Y-%m-%d\') as Date, ' +
          'cust.FirstName, ' +
          'cust.LastName, ' +
          'cust.CompanyName, ' +
          'a.Address1, ' +
          'a.City, ' +
          'a.State, ' +
          'substr(a.ZipCode, 1, 5) as Zip, ' +
          'dc.Discription as InvoiceDescription, ' +
          's.Discription as Description, ' +
          'sum(cs.Quanity) as ServiceQuantity, ' +
          'ac.Discription as AccountClass, ' +
          debitLine +
          creditLine +
          '\'Product or Service\' as Type ' +
        'FROM ' + 
          dbName + '.Customer cust, ' +
          dbName + '.Address a, ' + 
          dbName + '.' + debOrCrd + ' dc, ' +
          dbName + '.AccountClass ac, ' +
          dbName + '.Services s, ' +
          dbName + '.CustomerServices cs ' +
        'WHERE ' +
          'cust.CustomerID=dc.CustomerID AND ' +
          'cust.CustomerID=a.CustomerID AND ' +
          'cust.CustomerID=cs.CustomerID AND ' +
          'dc.ServiceID=cs.ServiceID AND ' +
          'a.Type=\'Home\' AND ' +
          'dc.Time >= \'' + startDateFormat + '\' AND ' + 
          'dc.Time < \'' + endDateFormat + '\' AND ' +
          'dc.ServiceID = s.ID AND ' +
          'dc.AccountClassID = ac.ID AND ' +
          's.ID NOT IN ' + serviceIds + ' AND ' +
          'dc.TaxTypeID IS NULL AND ' +
          'dc.AccountClassID NOT IN ' + paymentClass + ' ' +
        'GROUP BY CustomerID, InvoiceDescription, AccountClass, Date ' +
        'ORDER BY Date, CustomerID ';

    }


    var fut = new Future();
    var dbName = Meteor.settings.powercode.dbName;
    var sql = '(' +
          getTaxSql('Debits') +
        ') UNION ( ' +
          getTaxSql('Credits') +
        ') UNION ( ' +
          getTaxServiceSql('Debits') +
        ') UNION ( ' +
          getTaxServiceSql('Credits') +
        ') UNION ( ' +
          getServiceSql('Debits') +
        ') UNION ( ' +
          getServiceSql('Credits') +
        ')';
    runQuery(sql, fut);

    return fut.wait();

  }
});




