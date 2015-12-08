MdChargeBee.planIdToName = function (planId) {
  switch (planId) {
    case 'archive-service-annual':
      return 'Archive Service Annual';
    case 'archive-service-monthly':
      return 'Archive Service Monthly';
    default:
      return planId;
  }
};

MdChargeBee.planIdToAmount = function (planId) {
  switch (planId) {
    case 'archive-service-annual':
      return '$99/year';
    case 'archive-service-monthly':
      return '$9/month';
    default:
      return 0;
  }
};

