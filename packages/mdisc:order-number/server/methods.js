Meteor.methods({
    mdCreateOrderNumber: function () {
        var successFlag = 0;
        var order_number;
        do {
            order_number = MdOrderNumber.generateRandomOrderNumber();
            if (!MdOrderNumber.ordernumbers.findOne({orderNumber: order_number})) {
                successFlag = 1;
                MdOrderNumber.ordernumbers.insert({
                    orderNumber: order_number
                });
            }
        } while(!successFlag);
        return order_number;
    }
});