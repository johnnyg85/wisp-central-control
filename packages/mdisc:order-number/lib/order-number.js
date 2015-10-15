MdOrderNumber = {};

MdOrderNumber.generateRandomOrderNumber = function() {
    var result = "";
    for (var i=0;i<13;i++) {
        result += getRandomDigit().toString();
    }
    result = result.slice(0,3)+"-"+result.slice(3,7)+"-"+result.slice(7,10)+"-"+result.slice(10);
    return result;
};

var getRandomDigit = function() {
    return Math.floor(Math.random()*10);
};