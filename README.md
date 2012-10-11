
# Soil.js

The basic prototype collection for class base programming with JavaScript, jQuery.


## About

- Just extend the prototype, add basic features to your classes
- Events, Config, Model, Stack is available
- Requires jQuery


## Usage

### soil.Events

First of all, define the "Foo" class as below.
Extend the "soil.Events" using "soil.extend()".

```js
var Foo = function(){
	// Constructor
};
// Extend the Event's prototype
soil.extend(Foo, soil.Events);

// Set your own features
Foo.prototype.foo = "bar";
Foo.prototype.hoge = "fuga";
```

And initialize with "new".
on(), off(), trigger() is available now.

```js
var f = new Foo,
    handler = function(){ ... };

f.on("test", handler); // add event listener
f.trigger("test"); // fire the event

f.off("test", handler); // unregister event listener
f.trigger("test"); // nothing is happend
```

### soil.Model

This is example for "soil.Model".
set(), get() is available.

soil.Model has also save() and validate(), but they are empty function.
Then you have to write your own save method by yourself.

```js
var Person = function(){
	// Constructor
};
// can extend multiple classes
soil.extend(Person, soil.Model, soil.Events);

// Set your own attribute
Person.prototype.attr = {
	name : null,
	age : null,
	gender : null
};

// Your own save() method
Person.prototype.save = function(){
};
```

And initialize with "new",
then features of soil.Model and soil.Events are available now.

```js
var p = new Person;

p.set("name", "john");
p.set("age", 18);
p.set("gender", "male");

p.save(); // somwthing will be happend
```

```js
// set values with object
p.set({
	name : "john",
	age : 18,
	gender : "male"
});

// get value
p.get("name"); // => "john"

// get all values
p.get(); // => {name:"john", age:18, gender:"male"}
```

### Other Classes

soil.Config, soil.Stack is available.

## Author

mach3ss

- [Twitter](http://twitter.com/mach3ss)
- [Blog](http://blog.mach3.jp)
- [WebSite](http://www.mach3.jp)
