define(function() {
    var Base, UnexpectedValue = new Error();
    Base.prototype = new Error();
    UnexpectedValue.prototype = new Base();
    
    return { 
        "Base": Base,
        "UnexpectedValue": UnexpectedValue
    };
});