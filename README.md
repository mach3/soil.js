
# Soil.js

version 0.9.3 (2012/11)


## これはなに

- jQuery用のクラスライブラリです
- prototypeを継承して拡張します
- Soilオブジェクトのクラスを継承をすると基本的な機能が使えるようになります

## 使い方

### Soilのクラスを継承する

プロトタイプで書かれたクラスを plant メソッドで継承します。

```js
// 関数を定義します
var MyClass = function(){};

// plantメソッドでSoil.Eventsを継承すると、
// カスタムイベントが使えるようになります。
MyClass.plant(Soil.Events);

// valueが変わった時にchangeイベントを発火するようにします
// カスタムイベントの発火には trigger() を使います
MyClass.prototype.value = null;
MyClass.prototype.setValue = function(value){
	if(this.value !== value){
		this.value = value;
		this.trigger("change");
	}
	return this;
};
```

Functionに拡張された plant() メソッドで継承が出来ます。  
Soil.Eventsの他にも、Soilには基本的な機能を備えたクラス群が同梱してあります。  
後は new でインタンスを生成して使うだけです。

```js
// インスタンスを生成します
var instance = new MyClass();

// イベントハンドラの登録は on() を使います
instance.on("change", function(){
	console.log("My value has been changed to " + this.value);
});

instance.setValue("foo"); // <= "My value has been changed to foo"
```

### 複数クラスの継承

引数にクラスを列挙すれば複数のクラスから機能を継承できます。

```js
// 後に記述された物が優先されます。
MyClass.plant(Soil.Events, Soil.Attributes);
```

### 独自クラスの継承

内部では prototype の中身をコピーしているだけなので、勿論独自クラスも継承できます。

```js
var Animal = function(){};
...
var Dog = function(){};
Dog.plant(Animal);
```

## クラス群

### Soil.Config

#### option : Object

設定用の項目を定義します。（定義されていない項目は追加できません）

```js
MyClass.prototype.option = {
	foo : null,
	hoge : null
};
```

#### config( key:String|values:Object, value:* ) : *

値を設定または取得します。

```js
// 設定
instance.config("foo", "bar");
instance.config({"hoge" : "fuga"});

// 取得
instance.config("foo"); // <= "bar"
instance.config(); // <= {"hoge":"fuga", "foo":"bar"}
```

### Soil.Events

カスタムイベント機能を提供します。

#### on( type:String, handler:Function )
#### off( type:String, handler:Function )

on : イベントハンドラの登録。
off : イベントハンドラの解除。

```js
var handler = function(){}
instance.on("change", handler); // 登録
instance.off("change", handler); // 解除
```

#### trigger( type:String )

カスタムイベントを発火します。

```js
instance.trigger("change");
```

### Soil.Attributes

属性のセッター・ゲッターを提供します。

#### attr : Object

属性を定義します。（定義されていない属性は追加出来ません）

```js
Person.prototype.attr = {
	name : null,
	age : null
};
```

#### set( key:String, value:* )

属性の値を設定します。

```js
instance.set("name", "john");
instance.set("age", 18);
```

#### get( key:String ) : *

属性の値を取得します。

```js
instance.get("name"); // <= "john"
instance.get("age"); // <= 18
```

### Soil.Model

Soil.Events と Soil.Attributes を継承し、
両者の機能に加えて、値の変更時に change イベントを発火します。

```js
instance.on("change", function(){
	console.log("Changed to " + this.get("name"));
});

instance.set("name", "john"); // <= "Changed to john"
```

### Soil.Stack

値をスタックするクラス。

#### add( value:* )

値を追加します。

```js
instance.add("hoge");
instance.add("fuga", "foo", "bar", "baz");
```

#### fetch( [index:Integer] ) : *

値を取得します。

```js
instance.fetch(0); // <= "hoge"
instance.fetch(); // <= ["hoge", "fuga", "foo", "bar", "baz"]
```

#### index( [index:Integer] ) : *

内部インデックスを設定または取得します。
設定に成功するとインデックス番号を、失敗すると false を返します。

```js
instance.index(2); // <= 2
instance.index(); // <= 2

instance.index(100); // <= false
```

#### rewind()

内部インデックスを0に戻します。

```js
instance.index(3); // <= 3
instance.rewind();
instance.index(); // <= 0
```

#### next() / prev()

next : 内部インデックスを進めます  
prev : 内部インデックスを巻き戻します

```js
instance.index(3);
instance.next();
instance.index(); // <= 4
instance.prev();
instance.index(); // <= 3
```

#### current() : *

現在の値を取得します。

```js
instance.index(1);
instance.current(); // <= "fuga"
```

#### each( callback:Function )

値を走査し、コールバック関数に渡します。

```js
instance.each(function(index, value){
	console.log( index + ":" + value );
});
```

#### remove( index:Integer|callback:Function )

条件に合った値を削除します。
条件には、インデックス番号か、あるいはコールバック関数を渡すことができます。
（コールバック関数がtrueを返した場合に、その値を削除する）
削除後、インデックスは振り直されます。

```js
instance.remove(3); // <= "foo" を削除
instance.remove(function(value){
	return value === "hoge"; // <= "hoge" を削除
});
```

### Soil.View

ビュークラス。Mustacheのラッパーとしても働きます。
Soil.Attributes を継承。

#### template( [template:String] ) : *

テンプレートを設定あるいは取得します。
テンプレートの形式は、"{{key}}" を "value" に置換するだけの単純な物です。
keyが設定されていない場合は空白に置換されます。

```js
instance.template("Hello, {{name}} !");
instance.template(); // <= "Hello, {{name}} !"
```

#### render( [attr:Object] ) : String

レンダリング結果を文字列で返します。
引数にオブジェクトが渡された場合はその値を元にレンダリングし、
そうでない場合はインスタンスのattrを使用します。

```js
instance.set("name", "World");
instance.render(); // <= "Hello, World !"
instance.render({ name : "Earth" }); // <= "Hello, Earth !"
```

このクラス自体は単純な値の代入の機能しか備えていませんが、
レンダリング実行時にMustacheがロードされていればMustacheでレンダリングを行います。


## 作者

mach3

- [twitter](http://twitter.com/mach3ss)
- [github](http://github.com/mach3)
- [blog](http://blog.mach3.jp)


