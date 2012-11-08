
(function(){

	// Extend Prototype
	describe("prototype", function(){

		it("Function.prototype.scope()", function(){
			var Foo = {
				name : "foo",
				say : function(){
					return this.name;
				}
			};
			var Bar = {
				name : "bar"
			};

			expect(Foo.say()).toEqual("foo");
			expect(Foo.say.scope(Bar)()).toEqual("bar");
		});

		it("Function.prototype.plant()", function(){
			var A = function(){};
			A.prototype.foo = 1;
			A.prototype.bar = 2;

			var B = function(){};
			B.prototype.foo = 3;
			B.prototype.hoge = 4;

			var C = function(){};
			C.prototype.hoge = 5;
			C.prototype.fuga = 6;

			A.plant(B, C);

			var a = new A;

			expect({
				foo : a.foo,
				bar : a.bar,
				hoge : a.hoge,
				fuga : a.fuga
			})
			.toEqual({
				foo : 3,
				bar : 2,
				hoge : 5,
				fuga : 6
			});
		});
	});


	// Soil
	describe("Soil", function(){

		it("isObject(obj) : return if object or not", function(){
			var m = Soil.isObject;

			expect(m({key:"value"})).toEqual(true);
			expect(m("foo")).toEqual(false);
			expect(m([1,2,3])).toEqual(false);
			expect(m(123)).toEqual(false);
			expect(m(true)).toEqual(false);
			expect(m(false)).toEqual(false);
		});

		it("has(key) : aliase of hasOwnProperty", function(){
			var o, m;
			o = { a : 1, b : 2 };
			m = Soil.has;
			expect(m("a", o)).toEqual(true);
			expect(m("z", o)).toEqual(false);
		});

		it("rebase(obj) : for object prop problem", function(){
			var Foo = function(){};
			Foo.prototype.data = {
				hoge : "fuga",
				foo : "bar"
			};

			var a = new Foo;
			a.data = Soil.rebase(a.data);
			var b = new Foo;
			b.data = Soil.rebase(b.data);

			b.data.hoge = "fugafuga";
			b.data.foo = "barbar";

			expect(a.data.hoge).toEqual("fuga");
			expect(a.data.foo).toEqual("bar");
		});

		it("render(template, vars) : render the template by vars", function(){
			var template = "{{foo}} is {{bar}}";
			var vars = { foo : "FOO", bar : "BAR" };

			expect(Soil.render(template, vars)).toEqual("FOO is BAR");
		});

		it("extend() : extend the props", function(){

			var A = function(){};
			A.prototype.foo = 1;
			A.prototype.bar = 2;

			var B = function(){};
			B.prototype.foo = 3;
			B.prototype.hoge = 4;

			var C = function(){};
			C.prototype.hoge = 5;
			C.prototype.fuga = 6;

			Soil.extend(A, B, C);

			var a = new A;

			expect({
				foo : a.foo,
				bar : a.bar,
				hoge : a.hoge,
				fuga : a.fuga
			})
			.toEqual({
				foo : 3,
				bar : 2,
				hoge : 5,
				fuga : 6
			});

		});

	});


	// Soil.Events
	describe("Soil.Events", function(){

		var C, c;
		C = function(){};
		C.plant(Soil.Events);

		beforeEach(function(){
			c = new C;
		});

		afterEach(function(){
			c = null;
		});

		it("on(type, handler), trigger(type) : register handler, fire it", function(){
			var foo = 0;
			c.on("test", function(){
				foo += 1;
			});
			c.trigger("test").trigger("test");
			expect(foo).toEqual(2);
		});

		it("on(type, handler) : can register multiple handlers", function(){
			var foo = 0,
				handler = {
					a : function(){
						foo += 1;
					},
					b : function(){
						foo += 2;
					}
				};

			c.on("test", handler.a);
			c.on("test", handler.b);
			c.trigger("test").trigger("test");
			expect(foo).toEqual(6);
		});

		it("off(type, handler) : remove handler", function(){
			var foo = 0,
				handler = {
					a : function(){
						foo += 1;
					},
					b : function(){
						foo += 2;
					}
				};

			c.on("test", handler.a);
			c.on("test", handler.b);
			c.trigger("test").trigger("test"); // 6
			c.off("test", handler.b);
			c.trigger("test").trigger("test"); // 8

			expect(foo).toEqual(8);
		});
	});


	// Soil.Config
	describe("Soil.Config", function(){

		var C, c;
		C = function(){};
		C.plant(Soil.Config);
		C.prototype.option = {
			hoge : null,
			fuga : null
		};

		beforeEach(function(){
			c = new C;
		});

		it("config(key, [value]) : set or get the option value", function(){
			c.config("hoge", 1);
			c.config("fuga", 2);

			expect(c.config("hoge")).toEqual(1);
			expect(c.config("fuga")).toEqual(2);
		});

		it("config({}) : set or get the option with {}", function(){
			var o = {
				hoge : 1,
				fuga : 2
			};
			c.config(o);
			expect(c.config()).toEqual(o);
		});
	});


	// Soil.Attributes
	describe("Soil.Attributes", function(){

		var C, c;
		C = function(){};
		C.plant(Soil.Attributes);
		C.prototype.attr = {
			foo : 1,
			bar : true
		};

		beforeEach(function(){
			c = new C;
		});

		it("set(key, value), get(key) : set and get attributes", function(){
			c.set("foo", 2);
			c.set("bar", false);

			expect(c.get("foo")).toEqual(2);
			expect(c.get("bar")).toEqual(false);
		});

		it("set({}) : can recieve object", function(){
			c.set({
				foo : 2,
				bar : false
			});

			expect(c.get("foo")).toEqual(2);
			expect(c.get("bar")).toEqual(false);
		});

		it("get() : return all attribute", function(){
			expect(c.get()).toEqual(C.prototype.attr);
		});
	});


	// Soil.Model
	describe("Soil.Model", function(){

		var C, c;
		C = function(){};
		C.plant(Soil.Model);
		C.plant({
			attr : {
				foo : null,
				bar : null
			}
		});

		it("set(key, value), get(key) : from Soil.Attributes", function(){
			c = new C;
			c.set("foo", 1);
			c.set("bar", 2);
			expect(c.get()).toEqual({foo:1, bar:2});
		});

		it("on(type, handler), trigger(type) : from Soil.Events", function(){
			var changed = false;
			c = new C;
			c.on("change", function(){
				changed = true;
			});
			c.set("foo", 1);
			expect(changed).toEqual(true);
		});

	});


	// Soil.Stack
	describe("Soil.Stack", function(){

		var C, data, c;
		C = function(){};
		C.plant(Soil.Stack);
		data = ["hoge", "fuga", "foo", "bar"];

		beforeEach(function(){
			c = new C;
			c.add.apply(c, data);
		});

		it("has add() and fetch(index)", function(){
			expect(c.fetch(3)).toEqual("bar");
		});

		it("get() return all stack data", function(){
			expect(c.fetch()).toEqual(data);
		});

		it("index() can set or get the index", function(){
			expect(c.index()).toEqual(0);
			c.index(2);
			expect(c.index()).toEqual(2);
			c.index(100); // not exists, not changed
			expect(c.index()).toEqual(2);
		});

		it("next() advances the index", function(){
			expect(c.next()).toEqual(1);
			expect(c.next()).toEqual(2);
			expect(c.next()).toEqual(3);
			expect(c.next()).toEqual(false);
		});

		it("prev() rewind the index", function(){
			c.index(3);
			expect(c.prev()).toEqual(2);
			expect(c.prev()).toEqual(1);
			expect(c.prev()).toEqual(0);
			expect(c.prev()).toEqual(false);
		});

		it("rewind() set the index to the first", function(){
			c.index(3);
			c.rewind();
			expect(c.index()).toEqual(0);
		});

		it("current() can get the current value", function(){
			expect(c.current()).toEqual(data[0]);
			c.index(2);
			expect(c.current()).toEqual(data[2]);
		});

		it("each() iterate over the values", function(){
			var s = "";
			c.each(function(index, value){
				s += value;
			});
			expect(s).toEqual(c.fetch().join(""));
		});

		it("remove(index) remove the value by index", function(){
			c.remove(2);
			expect(c.fetch()).toEqual(["hoge", "fuga", "bar"]);
		});

		it("remove(function) remove by condition", function(){
			c.remove(function(value){
				return (value === "hoge" || value === "foo")
			});
			expect(c.fetch()).toEqual(["fuga", "bar"]);
		});
	});


	// Soil.View
	describe("Soil.View", function(){

		var C, c;
		C = function(){};
		C.plant(Soil.View);

		it("template([template]) : set or get template", function(){
			var t;

			c = new C;
			t = "{{foo}}, {{bar}}";
			c.template("{{foo}}, {{bar}}");

			expect(c.template()).toEqual(t);
		});

		it("render([vars]) : get rendered string", function(){
			C.plant({
				attr : {
					foo : null,
					bar : null
				}
			});
			c = new C;
			c.template("{{foo}} is {{bar}}");
			c.set({
				foo : "Foo",
				bar : "Bar"
			});

			expect(c.render()).toEqual("Foo is Bar");
			expect(c.render({foo : "FOO", bar : "BAR"})).toEqual("FOO is BAR");
		});

		it("if has Mustache, use Mustache.render()", function(){
			if(Mustache){
				C.plant({
					attr : {
						bool : null,
						message : null
					}
				});
				c = new C;
				c.template("{{#bool}}<strong>{{message}}</strong>{{/bool}}");
				c.set({
					bool : true,
					message : "Hello, World !"
				});
				expect(c.render()).toEqual("<strong>Hello, World !</strong>");
				expect(c.render({bool:false, message:"foo"})).toEqual("");
			}
		});

	});

	describe("Soil.HashChange", function(){

		it("start() : start to watch the hash change event", function(){

			var c, done = 0, data = [];

			location.hash = "";

			setTimeout(function(){
				c = new Soil.HashChange;
				c.on(c.EVENT_HASH_CHANGE, function(){
					data.push(this.getHash());
				});
				c.start();
			}, 100);
			setTimeout(function(){ 
				location.hash = "hoge" 
				done += 1;
			}, 200);
			setTimeout(function(){ 
				location.hash = "fuga" 
				done += 1;
			}, 300);
			setTimeout(function(){
				location.hash = "foo"
				done += 1;
			}, 400);
			setTimeout(function(){
				done += 1;
			}, 500);

			waitsFor(function(){
				return done === 4;
			});

			runs(function(){
				expect(data).toEqual(["#hoge", "#fuga", "#foo"]);
			});
		});

		it("fallback onhashchange by timeout", function(){

			var c, done = 0, data = [];

			location.hash = "";

			setTimeout(function(){
				c = new Soil.HashChange;
				c.config("support", false);
				c.on(c.EVENT_HASH_CHANGE, function(){
					data.push(this.getHash());
				});
				c.start();
			}, 100);

			setTimeout(function(){ 
				location.hash = "hoge" 
				done += 1;
			}, 200);
			setTimeout(function(){ 
				location.hash = "fuga" 
				done += 1;
			}, 300);
			setTimeout(function(){
				location.hash = "foo"
				done += 1;
			}, 400);
			setTimeout(function(){
				done += 1;
			}, 500);

			waitsFor(function(){
				return done === 4;
			});

			runs(function(){
				expect(data).toEqual(["#hoge", "#fuga", "#foo"]);
			});
		});

	});

}());
