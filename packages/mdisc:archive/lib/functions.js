//format Archive name

mdArchiveName = function(name) {
  lastchar = name[name.length - 1];
  if (lastchar == 's' || lastchar == 'S') {
    name = name + "' Photos";
  }
  else {
    name = name + "'s Photos";
  }
  return name;
};
