//format Archive name

mdArchiveName = function(name) {
  lastchar = name[name.length - 1];
  if (lastchar == 's' || lastchar == 'S') {
    name = name + "' Archive";
  }
  else {
    name = name + "'s Archive";
  }
  return name;
};
