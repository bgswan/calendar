var visibleCalendar = {
  weeks : [],
  
  init : function() {
    for(var i = 0; i < 7; i++) {
      this.weeks.push(this.weekIncluding(new XDate().addDays(7*i)));
    }
  }, 

  weekIncluding : function(d) {
    var offsets = [6, 0, 1, 2, 3, 4, 5];
    var result = [];

    for(var i = 0; i <= 6; i++) {
      result.push(d.clone().addDays(i - offsets[d.getDay()]));
    }
    return result;
  },
  
  lastWeek : function() {
    return this.weeks[this.weeks.length -1];
  },
  
  firstWeek : function() {
    return this.weeks[0];
  },
  
  forward : function() {    
    this.weeks.push(this.weekIncluding(this.lastWeek()[6].addDays(1))); // add a week after the last week
    this.weeks.shift(); // remove the first week
  },  
  
  back : function() {  
    this.weeks.unshift(this.weekIncluding(this.firstWeek()[0].addDays(-1))); // add a week before the first week
    this.weeks.pop(); // remove the last week
  }, 
  
  years : function() {
    // find the unique years
    return this.weeks.reduce(function(memo, week) {      
      week.forEach(function(day) {
        var y = day.toString('yyyy');
        if (memo.indexOf(y) === -1) {
          memo.push(y);
        }        
      });
      return memo;
    }, []).join('-');    
  }
};

var toRow = function(week) {
  var first = firstOfMonth(week);
  var result = '<tr>' + monthCell(first);
  week.forEach(function(day) {
    result += toCell(day, first)
  });
  result += '</tr>'
  return result;
};

var toCell = function(day, first) {
  return '<td' + classesFor(day, first) + '>' + day.toString('dd') + '</td>';
};

var classesFor = function(day, first) {
  var classes = [];
  if(first && day === first) {
    classes.push('first-of-month');
  } else if(first && day < first) {
    classes.push('end-of-month');
  } else if(first && day > first) {
    classes.push('start-of-month');
  }
  return classes.length === 0 ? '' : ' class="' + classes.join(" ") + '"';
};

var monthCell = function(first) {
  if(first) {
    return '<td class="month-name">' + first.toString('MMMM') + '</td>';
  } else {
    return '<td>&nbsp;</td>';
  }
};

var firstOfMonth = function(week) {
  return week.filter(function(item) {
    return item.getDate() === 1;
  })[0];
}

var timer;
var speed = 100;

var scrollForward = function() {
  visibleCalendar.forward();
  $('#calendar .year').text(visibleCalendar.years());
  $('#calendar tbody tr:last').after(toRow(visibleCalendar.lastWeek()));
  $('#calendar tbody tr:first').remove();
}

var scrollBack = function() {
  visibleCalendar.back();
  $('#calendar .year').text(visibleCalendar.years());
  $('#calendar tbody tr:first').before(toRow(visibleCalendar.firstWeek()));
  $('#calendar tbody tr:last').remove();
}

$(document).ready(function() {
  visibleCalendar.init();
  
  $('#calendar .year').text(visibleCalendar.years());
  
  visibleCalendar.weeks.forEach(function(week) {
    $('#calendar tbody').append(toRow(week));
  });
  
  $('#calendar-container #scroll-forward').mousedown(function() {
    timer = setInterval('scrollForward()', speed);
  }).mouseup(function() {
    clearInterval(timer);
  });

  $('#calendar-container #scroll-back').mousedown(function() {
    timer = setInterval('scrollBack()', speed);
  }).mouseup(function() {
    clearInterval(timer);
  });
});