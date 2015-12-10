MdDates = {};

MdDates.getMonths = function () {
    return [
        {name: "Jan", val: "01"},
        {name: "Feb", val: "02"},
        {name: "Mar", val: "03"},
        {name: "Apr", val: "04"},
        {name: "May", val: "05"},
        {name: "Jun", val: "06"},
        {name: "Jul", val: "07"},
        {name: "Aug", val: "08"},
        {name: "Sep", val: "09"},
        {name: "Oct", val: "10"},
        {name: "Nov", val: "11"},
        {name: "Dec", val: "12"}
    ];
};

MdDates.getYears = function () {
    var d = new Date();
    var years = new Array();
    for (var i = 0, year = d.getFullYear(); i <= 30; i++, year++) {
        years.push({"year": year});
    }
    return years;
};

MdDates.nextYear = function () {
  var d = new Date();
  return d.getFullYear()+1;
};