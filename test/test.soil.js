

// soil.fn
describe("soil.fn", function(){

	it("isObject return if object or not", function(){
		var m = soil.fn.isObject;

		expect(m({key:"value"})).toEqual(true);
		expect(m("foo")).toEqual(false);
		expect(m([1,2,3])).toEqual(false);
		expect(m(123)).toEqual(false);
		expect(m(true)).toEqual(false);
		expect(m(false)).toEqual(false);
	});

	it("has is aliase of hasOwnProperty", function(){
		var o = { a : 1, b : 2 };
		expect(soil.fn.has("a", o)).toEqual(true);
		expect(soil.fn.has("z", o)).toEqual(false);
	});

});

// soil.extend
describe("soil.extend", function(){

	it("extend their prototype", function(){
		var A = function(){};
		A.prototype.foo = 1;
		A.prototype.bar = 2;

		var B = function(){};
		soil.extend(B, A);
		B.prototype.foo = 3;

		var C = function(){};
		soil.extend(C, A, B);
		C.prototype.bar = 4;
		C.prototype.hoge = 5;

		var c = new C;

		expect({
			foo  : c.foo,
			bar : c.bar,
			hoge : c.hoge
		}).toEqual({
			foo : 3,
			bar : 4,
			hoge : 5
		});
	});
});


// soil.Events
describe("soil.Events", function(){

	var C, c;
	C = function(){};
	soil.extend(C, soil.Events);

	beforeEach(function(){
		c = new C;
	});

	afterEach(function(){
		c = null;
	});

	it("register by on(), fire by trigger()", function(){
		var foo = 0;
		c.on("test", function(){
			foo += 1;
		});
		c.trigger("test").trigger("test");
		expect(foo).toEqual(2);
	});

	it("can register multiple handlers", function(){
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

	it("remove handler by off()", function(){
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

// soil.Config
describe("soil.Config", function(){

	var C, c;
	C = function(){};
	soil.extend(C, soil.Config);
	C.prototype.option = {
		hoge : null,
		fuga : null
	};

	beforeEach(function(){
		c = new C;
	});

	it("set or get the option value by config()", function(){
		c.config("hoge", 1);
		c.config("fuga", 2);
		expect(c.config("hoge")).toEqual(1);
		expect(c.config("fuga")).toEqual(2);
	});

	it("set or get the option with {}", function(){
		var o = {
			hoge : 1,
			fuga : 2
		};
		c.config(o);
		expect(c.config()).toEqual(o);
	});
});

// soil.Model
describe("soil.Model", function(){

	var C, c;
	C = function(){};
	soil.extend(C, soil.Model);
	C.prototype.attr = {
		foo : 1,
		bar : true
	};

	beforeEach(function(){
		c = new C;
	});

	it("has set(key, value) and get(key)", function(){
		c.set("foo", 2);
		c.set("bar", false);

		expect(c.get("foo")).toEqual(2);
		expect(c.get("bar")).toEqual(false);
	});

	it("set() can be passed Object", function(){
		c.set({
			foo : 2,
			bar : false
		});

		expect(c.get("foo")).toEqual(2);
		expect(c.get("bar")).toEqual(false);
	});

	it("get() can return all attribute", function(){
		expect(c.get()).toEqual(C.prototype.attr);
	});
});

// soil.Stack
describe("soil.Stack", function(){

	var Stack, data, c;
	Stack = function(){};
	soil.extend(Stack, soil.Stack);
	data = ["hoge", "fuga", "foo", "bar"];

	beforeEach(function(){
		c = new Stack;
		c.add.apply(c, data);
	});

	it("has add() and get(index)", function(){
		expect(c.get(3)).toEqual("bar");
	});

	it("get() return all stack data", function(){
		expect(c.get()).toEqual(data);
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
		expect(s).toEqual(c.get().join(""));
	});

	it("remove(index) remove the value by index", function(){
		c.remove(2);
		expect(c.get()).toEqual(["hoge", "fuga", "bar"]);
	});

	it("remove(function) remove by condition", function(){
		c.remove(function(value){
			return (value === "hoge" || value === "foo")
		});
		expect(c.get()).toEqual(["fuga", "bar"]);
	});
});

