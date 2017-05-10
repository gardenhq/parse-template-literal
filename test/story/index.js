var should = require('should');
const h = function node(name, attr)
{
    const children = arguments.length > 2 ? Array.prototype.slice.apply(arguments, [2]) : [];
    return `<${name}${ 
            Object.keys(attr || {}).map(
                function(key)
                {
                    return ` ${key}="${attr[key]}"`;
                }
            ).join("") 
    }>${children.join("")}</${name}>`;
}

describe(
    'parse-template-literal',
    function()
    {
        var parse = require('../../');
        describe(
            "compile",
            function()
            {
                context(
                    "given a compiled template with a div",
                    function()
                    {
                        const expected = '<div hi="hi" there="there" />';
                        const compiled = parse.compile('<div hi="${hi}" there="${there}" />', {hi: "hi", there: "there"});
                        it(
                            "compiles a renderable template, using compiled.render()",
                            function()
                            {
                                compiled.render({hi: "hi", there: "there"}).should.equal(expected);
                            }
                        );
                        it(
                            "compiles a renderable template, using parse.render(), being compiled with compile(template, Array)",
                            function()
                            {
                                const compiled = parse.compile('<div hi="${hi}" there="${there}" />', ["hi", "there"]);
                                console.log(compiled("hi", "there"));
                                compiled.render({hi: "hi", there: "there"}).should.equal(expected);
                            }
                        );
                    }
                );
                context(
                    "given a compiled template with a sourceURL",
                    function()
                    {
                        const expected = '<div hi="hi" there="there" />';
                        const compiled = parse.compile('<div hi="${hi}" there="${there}" /><!--# sourceURL=something.js -->', {hi: "hi", there: "there"});
                        it.skip(
                            "extracts the filename",
                            function()
                            {
                                console.log(compiled({hi: "hi", there: "there"}));
                            }
                        );
                    }
                );
            }
        );
        describe(
            "render",
            function()
            {
                context(
                    "Given an empty div",
                    function()
                    {
                        it(
                            'returns my template',
                            function()
                            {
                                const actual = parse.render("<div />");
                                var expected = ("<div />").trim();
                                actual.should.equal(expected);
                            }
                        );
                    }
                );
                context(
                    "Given a div with some vars",
                    function()
                    {
                        it(
                            'returns my template',
                            function()
                            {
                                const actual = parse.render('<div id="${id}" />', {id: "id"});
                                var expected = ('<div id="id" />').trim();
                                // console.log(render(render.parse(h("div", {id: "id"}, h("p")))));
                                actual.should.equal(expected);
                            }
                        );
                    }
                );

            }
        );

    }
);
