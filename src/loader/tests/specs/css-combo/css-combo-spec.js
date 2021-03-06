/*jshint quotmark:false*/
/*global $*/
describe("css-combo", function () {
    beforeEach(function () {
        KISSY.config('combine', true);
    });

    afterEach(function () {
        KISSY.clearLoader();
    });

    it("works for css and js", function () {
        $("<div>" +
            "<div class='test2'></div>" +
            "<div class='test1'></div>" +
            "</div>").appendTo('body');

        KISSY.config({
            packages: {
                x: {
                    base: window.specsPath || "../specs/css-combo/x"
                }
            },
            modules: {
                "x/x1": {
                    requires: ["x/x2","x/x1.css"]
                },
                "x/x2": {
                    requires: ["x/x2.css"]
                }
            }
        });

        var ret = 0;

        KISSY.use("x/x1", function (S, X1) {
            expect(X1).toBe(2);
            expect($(".test1").css("font-size")).toBe("20px");
            expect($(".test2").css("font-size")).toBe("30px");
            ret = 1;
        });

        waitsFor(function () {
            return ret;
        });

        runs(function(){

            $('link[href*="x2.css"]').remove();
            $('link[href*="x1.css"]').remove();

        });
    });

    it("works for css and js when taged", function () {
        var S = KISSY;

        $("<div>" +
            "<div class='test2'></div>" +
            "<div class='test1'></div>" +
            "</div>").appendTo('body');

        KISSY.config({

            packages: {
                x: {
                    tag: S.Loader.Utils.now(),
                    base: window.specsPath || "../specs/css-combo/x"
                }
            },
            modules: {
                "x/x1": {
                    requires: ["x/x1.css", "x/x2"]
                },
                "x/x2": {
                    requires: ["x/x2.css"]
                }
            }
        });

        var ret = 0;

        KISSY.use("x/x1", function (S, X1) {
            expect(X1).toBe(2);
            expect($(".test1").css("font-size")).toBe("20px");
            expect($(".test2").css("font-size")).toBe("30px");
            ret = 1;
        });

        waitsFor(function () {
            return ret;
        });

    });
});