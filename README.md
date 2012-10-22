
# Soil.js

The basic prototype collection for class base programming with JavaScript, jQuery.


## About

- Just extend the prototype, add basic features to your classes
- Events, Config, Model, Stack is available
- Requires jQuery


## Usage

### Soil.Events

First of all, define the "Foo" class as below.
Extend the "Soil.Events" using "Soil.extend()".

```js
var Foo = function(){
	// Constructor
};
// Extend the Event's prototype
Soil.extend(Foo, Soil.Events);

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

### Soil.Model

This is example for "Soil.Model".
set(), get() is available.
And also on(), trigger() of soil.Events is available.

```js
var Person = function(){
	// Constructor
};
// can extend multiple classes
Soil.extend(Person, Soil.Model);

// Set your own attribute
Person.prototype.attr = {
	name : null,
	age : null,
	gender : null
};
```

And initialize with "new",
then features of Soil.Model and Soil.Events are available now.

```js
var p = new Person;

p.on("change", function(){
	// "change" event will be fired when something changed.
	console.log("something has been changed");
});

p.set("name", "john");
p.set("age", 18);
p.set("gender", "male");
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

- Soil.Attributes
- Soil.Config
- Soil.Stack
- Soil.View

## Author

mach3ss

- [Twitter](http://twitter.com/mach3ss)
- [Blog](http://blog.mach3.jp)
- [WebSite](http://www.mach3.jp)
