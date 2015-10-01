WtMenu =  {
  dropdown: [],
  primary: [],
  addDropdown: function(name, icon, displayOrder, roles) {
    if (!roles) {
      roles = [];
    }
    var i = this.indexFor(name);
    this.dropdown[i].dropdownIcon = icon;
    this.dropdown[i].displayOrder = displayOrder;
    this.dropdown[i].roles = roles;

    
  },
  indexFor: function(dropdownName) {
    var len = this.dropdown.length;
    var isNew = true;
    var index = 0;
    for (var i = 0; i < len; i++) {
      if (this.dropdown[i].dropdownName == dropdownName) {
        isNew = false;
        index = i;
        break;
      }
    }
    if (isNew) {
      index = i;
      this.dropdown[i] = {};
      this.dropdown[i].dropdownName = dropdownName;
      this.dropdown[i].dropdownIcon = '';
      this.dropdown[i].displayOrder = 0;
      this.dropdown[i].roles = [];
      this.dropdown[i].items = [];
    }

    return index;
  },
  addDropdownItem: function(dropdownName, name, route, icon, displayOrder, roles) {
    if (!roles) {
      roles = [];
    }

    var i = this.indexFor(dropdownName);
    var n = this.dropdown[i].items.length;

    this.dropdown[i].items[n] = {};
    this.dropdown[i].items[n].itemName = name;
    this.dropdown[i].items[n].itemRoute = route;
    this.dropdown[i].items[n].itemIcon = icon;
    this.dropdown[i].items[n].displayOrder = displayOrder;
    this.dropdown[i].items[n].roles = roles;
  },
  addPrimary: function(name, route, icon, displayOrder, roles) {
    if (!roles) {
      roles = [];
    }
    var p = {};
    p.name = name;
    p.route = route;
    p.icon = icon;
    p.roles = roles;
    this.primary.push(p);
  }
};


