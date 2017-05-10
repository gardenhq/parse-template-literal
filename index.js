// const parse = function()
// {
//  return arguments;
// }
// const literal = function(template, args, names)
// {
//  return eval("(function(" + names + "){return parse`" + template + "`;}).apply(null, args)");
// }
const compile = function(template, vars, filename)
{
    if(filename == null) {
        const match = template.match(/# sourceURL=(\S*)/);
        if(match) {
            filename = match[1];
        } else {
            filename = "compiled-template";
        }
    }
    const argNames = vars == null ? [] : Array.isArray(vars) ? vars : Object.keys(vars);
    const F = Function;
    const parse = function()
    {
        return arguments;
    }
    const compiled = (
        new (
            F.prototype.bind.apply(
                F,
                [F].concat(argNames.concat(['"use strict";return function(){return arguments;}`' + template + '`//# sourceURL=' + filename]))
            )
        )
    );
    compiled.prepare = function(obj)
    {
        const args = [];
        Object.keys(obj).forEach(
            function(key)
            {
                args.push(obj[key]);
            }
        );
        return compiled.apply(null, args)
    }
    compiled.render = function(obj)
    {
        return render(this.prepare(obj));
    }
    return compiled;
}
const parse = function(template, vars, filename)
{
    var argNames = vars == null ? [] : Object.keys(vars);
    return compile(template, vars, filename).apply(
        null,
        argNames.map(
            function(key)
            {
                return vars[key]
            }
        )
    );
};
const render = function(callSite, vars)
{

    if(typeof callSite === "string") {
        const template = callSite;
        callSite = parse.apply(
            null,
            [
                typeof template != "string" ? template[0] : template,
                vars
            ]
        )
    }
    return String.raw.apply(
        null,
        callSite
    );
}
parse.render = render;
parse.compile = compile;
module.exports = parse;

