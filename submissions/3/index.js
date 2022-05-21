function add() {
    if (arguments.length == 1) {
        let x = arguments[0];
        return function(y) {
            return x + y;
        }
    } else {
        let s = 0;
        for (const item of arguments) {
            s = s + item;
        }
        return s;    
    }
}

console.log(add(4, 6));
console.log(add(4)(6));