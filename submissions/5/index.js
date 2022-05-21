// setTimeout() is asynchronous: The JS engine will not wait n seconds (1s in your example), before proceeding. It just makes a 'mental note' : "After 1s, execute (in this case) the Alert", and continues executing the loop. It does all 5 (or 5s) iterations before the 1s is over, so eventually, when that time DOES elapse, it spits out all 5 (or 5s) alerts at once).
// Follows are updated code.

function testOrderPrint() {
  for (var i = 0; i < 5; ++i) {
    setTimeout(function(j){
      console.log(i);
    }(i), 1000);
  }
}

testOrderPrint();