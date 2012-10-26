/**
 * Classes with prototypes
 *
 * @author Manuel Leueneberger
 */

var Class = function(superClass, constructor, methods) {
    var classs = constructor;
    classs.prototype = new superClass();
    classs.prototype.constructor = constructor;
    for(var name in methods) {
        if (methods.hasOwnProperty(name)) {
            classs.prototype[name] = methods[name];
        }
    }
    this.contructor = classs;
    return classs;
};