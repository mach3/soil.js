
# Soil.js


1. これはなに
2. 簡単な使い方
3. クラス群

## これはなに

- jQuery用のクラスライブラリです
- prototypeを継承して拡張します
- Soilオブジェクトのクラスを継承をすると基本的な機能が使えるようになります

## 簡単な使い方

### Soilのクラスを継承する

プロトタイプで書かれたクラスを plant メソッドで継承します。

```js
// 関数を定義します
var MyClass = function(){};

// plantメソッドでSoil.Eventsを継承すると、
// カスタムイベントが使えるようになります。
MyClass.plant(Soil.Events);
MyClass.prototype.value = null;
// valueが変わった時にchangeイベントを発火するようにします
// カスタムイベントの発火には trigger() を使います
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

```
// インスタンスを生成します
var instance = new MyClass();

// イベントハンドラの登録は on() を使います
instance.on("change", function(){
	console.log("My value has been changed to " + this.value);
});

instance.setValue("foo"); // <= "My value has been changed to foo"
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

設定用の項目を定義する。（定義されていない項目は追加できない）

```
MyClass.prototype.option = {
	foo : null,
	hoge : null
};
```

#### config( key:String|values:Object, value:* ) : *

値を設定または取得する。

```
// 設定
instance.config("foo", "bar");
instance.config({"hoge" : "fuga"});

// 取得
instance.config("foo"); // <= "bar"
instance.config(); // <= {"hoge":"fuga", "foo":"bar"}
```

### Soil.Events

カスタムイベント機能を提供する。

#### on( type:String, handler:Function ) / off( type:String, handler:Function )

on : イベントハンドラの登録。
off : イベントハンドラの解除。

```
var handler = function(){}
instance.on("change", handler); // 登録
instance.off("change", handler); // 解除
```

#### trigger( type:String )

カスタムイベントを発火する。

```
instance.trigger("change");
```

### Soil.Attributes

属性のセッター・ゲッターを提供する。

#### attr : Object

属性を定義する。（定義されていない属性は追加出来ない）

```
Person.prototype.attr = {
	name : null,
	age : null
};
```

#### set( key:String, value:* )

属性の値を設定する。

```
instance.set("name", "john");
instance.set("age", 18);
```

#### get( key:String )

属性の値を取得する。

```
instance.get("name"); // <= "john"
instance.get("age"); // <= 18
```

### Soil.Model

Soil.Events と Soil.Attributes を継承し、
両者の機能に加えて、値の変更時に change イベントを発火する。

```
instance.on("change", function(){
	console.log("Changed to " + this.get("name"));
});

instance.set("name", "john"); // <= "Changed to john"
```

### Soil.Stack

値をスタックするクラス。

#### add( value:* )

値を追加する。

```
instance.add("hoge");
instance.add("fuga", "foo", "bar", "baz");
```

#### fetch( [index:Integer] ) : *

値を取得する。

```
instance.fetch(0); // <= "hoge"
instance.fetch(); // <= ["hoge", "fuga", "foo", "bar", "baz"]
```

#### index( [index:Integer] ) : *

内部インデックスを設定または取得する。
設定に成功するとインデックス番号を、失敗すると false を返す。

```
instance.index(2); // <= 2
instance.index(); // <= 2

instance.index(100); // <= false
```

#### rewind()

内部インデックスを0に戻す。

```
instance.index(3); // <= 3
instance.rewind();
instance.index(); // <= 0
```

#### next() / prev()

next : 内部インデックスを進める  
prev : 内部インデックスを巻き戻す

```
instance.index(3);
instance.next();
instance.index(); // <= 4
instance.prev();
instance.index(); // <= 3
```

#### current() : *

現在の値を取得する。

```
instance.index(1);
instance.current(); // <= "fuga"
```

#### each( callback:Function )

値を走査する。

```
instance.each(function(index, value){
	console.log( index + ":" + value );
});
```

#### remove( index:Integer|callback:Function )

条件に合った値を削除する。
条件には、インデックス番号か、あるいはコールバック関数を渡す。
削除後、インデックスは振り直される。

```
instance.remove(3); // <= "foo" を削除
instance.remove(function(value){
	return value === "hoge"; // <= "hoge" を削除
});
```

### Soil.View

ビュークラス。Mustacheのラッパーとしても働く。
Soil.Attributes を継承している。

#### template( [template:String] ) : *

テンプレートを設定あるいは取得する。

```
instance.template("Hello, {{name}} !");
instance.template(); // <= "Hello, {{name}} !"
```

#### render( [attr:Object] ) : String

レンダリング結果を文字列で返す。
引数にオブジェクトが渡された場合、その値を元にレンダリングする。
そうでない場合、インスタンスのattrを使用する。

```
instance.set("name", "World");
instance.render(); // <= "Hello, World !"
instance.render({ name : "Earth" }); // <= "Hello, Earth !"
```

このクラス自体は単純な値の代入の機能しか備えていないが、
MustacheがロードされていればMustacheでレンダリングを行う。

