# FormKeeper
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
	$('#form').formKeeper([options]);
	```

## 插件选项

```JavaScript
defaultOptions = {
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
clearOnSubmit | `boolean` | 在提交表单后自动清数据，默认值：`false`
backupForm | `function` | 提取表单数据
restoreForm | `function` | 还原表单数据
backupData | `function` | 备份数据
restoreData | `function` | 还原数据
clearData | `function` | 清除数据

## 提取/还原表单数据

插件默认将在：
* 离开本页时提取数据
* 初始化插件时还原表单数据

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
	function backupData(data) {
		// save data to some place
	}
	```

* restoreData

	```JavaScript
	function restoreData() {
		// get data
		return data;
	}
	```

* clearData

	```JavaScript
	function clearData() {
		// clear data
	}
	```
