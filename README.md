# FormKeeper [![Build Status](https://travis-ci.org/Illvili/jQuery.formKeeper.svg?branch=master)](https://travis-ci.org/Illvili/jQuery.formKeeper) [![Code Climate](https://codeclimate.com/github/Illvili/jQuery.formKeeper/badges/gpa.svg)](https://codeclimate.com/github/Illvili/jQuery.formKeeper)
随时随地保存表单数据

## 使用方法

1. 引用 `jQuery`

	```html
	<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
	```

2. 引用 `FormKeeper`

	```html
	<script src="dist/jquery.formkeeper.min.js"></script>
	```

3. 调用函数

	```JavaScript
	$('#form').formKeeper();
	```

## 同页面多个表单

默认使用当前页面URL的`pathname`转换出表单ID

但可通过指定`data-formid`或`options`中的`formId`来指定表单ID

`/demo/demo.html`将转换为`_demo_demo.html`

## 插件选项

```JavaScript
defaultOptions = {
	restoreAtInit: true,
	backupAtLeave: true,
	clearOnSubmit: false,

	backupForm: $.fn.formKeeper.backupForm,
	restoreForm: $.fn.formKeeper.restoreForm,

	backupData: $.fn.formKeeper.backupData,
	restoreData: $.fn.formKeeper.restoreData,
	clearData: $.fn.formKeeper.clearData
}
```

参数 | 类型 | 说明
-----|------|-----
formId | `string` | 表单ID，默认值：`undefined` 使用URL来自动生成
restoreAtInit | `boolean` | 初始化插件时自动恢复数据，默认值：`true`
backupAtLeave | `boolean` | 离开页面时自动备份数据，默认值：`true`
clearOnSubmit | `boolean` | 在提交表单后自动清数据，默认值：`false`
backupForm | `function` | 提取表单数据
restoreForm | `function` | 还原表单数据
backupData | `function` | 备份数据
restoreData | `function` | 还原数据
clearData | `function` | 清除数据

## 方法

* destroy
	卸载插件，并清除事件绑定
	```Javascript
	$('#form').formKeeper('destroy');
	```

* backup
	备份表单数据
	```Javascript
	$('#form').formKeeper('backup');
	```

* restore
	还原表单数据
	```Javascript
	$('#form').formKeeper('restore');
	```

* clear
	清除表单数据
	```Javascript
	$('#form').formKeeper('clear');
	```


## 提取/还原表单数据

插件默认将在：
* 如果设定`restoreAtInit`：离开页面时提取表单数据
* 如果设定`backupAtLeave`：初始化插件时还原表单数据

如果需要保存自定义数据，可以传递给`options`

* backupForm

	```JavaScript
	function backupForm(form) {
		// deal with form and fetch data
		return data;
	}
	```

* restoreForm

	```JavaScript
	function restoreForm(form, data) {
		// restore form with data
	}
	```

## 备份/还原/清除数据

插件默认使用`localStorage`来保存数据

如果需要自定义保存方式，可以传递给`options`

* backupData

	```JavaScript
	function backupData(formId, data) {
		// save data to some place
	}
	```

* restoreData

	```JavaScript
	function restoreData(formId) {
		// get data
		return data;
	}
	```

* clearData

	```JavaScript
	function clearData(formId) {
		// clear data
	}
	```

## 测试

```
npm install
grunt travis
```

将会运行函数测试

## 其它

整个项目基于[jquery-boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate)

## 更新

* v 1.1.0

	* 更改`$.fn.formKeeper.backupForm`和`$.fn.formKeeper.restoreForm`保存数据格式 **无法兼容前一版本数据**

* v 1.0.0

	初始版本
