/*
 *  formkeeper - v1.0.0
 *  Using localStorage backup and restore form data
 *  
 *
 *  Made by 
 *  Under NoLicense License
 */
// this plugin is based on https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Extending-jQuery-Boilerplate
;(function (defaults, $, window, document, undefined) {

	// Default options
	var pluginName = "formKeeper";

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({
			backupForm: $.fn.formKeeper.backupForm,
			restoreForm: $.fn.formKeeper.restoreForm,

			backupData: $.fn.formKeeper.backupData,
			restoreData: $.fn.formKeeper.restoreData,
			clearData: $.fn.formKeeper.clearData
		}, defaults, options) ;

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	// Plugin functions
	Plugin.prototype = {
		init: function () {
			var that = this;

			if (this.options.restoreAtInit) {
				$(function () {
					that.restore();
				});
			}

			if (this.options.backupAtLeave) {
				$(window).on("beforeunload." + pluginName, function () {
					that.backup();
				});
			}

			if (this.options.clearOnSubmit) {
				this.element.on("submit." + pluginName, function () {
					that.clear();
				});
			}
		},
		destroy: function () {
			if (this.options.backupAtLeave) {
				$(window).off("beforeunload." + pluginName);
			}

			if (this.options.clearOnSubmit) {
				this.element.off("submit." + pluginName);
			}
		},

		backup: function () {
			this.options.backupData(this.options.backupForm(this.element));
		},

		restore: function () {
			this.options.restoreForm(this.element, this.options.restoreData());
		},

		clear: function () {
			this.options.clearData();
		}
	};

	// extends $.fn
	$.fn[pluginName] = function (options) {
		var args = arguments;

		if (options === undefined || typeof options === "object") {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName,
					new Plugin( this, options ));
				}
			});
		} else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
			var returns;
			this.each(function () {
				var instance = $.data(this, "plugin_" + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === "function") {
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}

				if (options === "destroy") {
					$.data(this, "plugin_" + pluginName, null);
				}
			});

			return returns !== undefined ? returns : this;
		}
	};

	// form reader and saver
	$.fn[pluginName].backupForm = function (form) {
		var data = {
			input: {},
			checkbox: {},
			radio: {}
		};

		$(form).find(":input").each(function () {
			var input = $(this), name = input.prop("name");
			if (!name) {
				return;
			}

			if (input.is(":radio")) {
				if (!input.prop("checked")) {
					return;
				}

				data.radio[name] = input.val();
			} else if (input.is(":checkbox")) {
				if (!input.prop("checked")) {
					return;
				}

				if (!data.checkbox[name]) {
					data.checkbox[name] = [];
				}
				data.checkbox[name].push(input.val());
			} else {
				data.input[name] = input.val();
			}
		});

		return data;
	};

	$.fn[pluginName].restoreForm = function (form, data) {
		$(form).find(":input").each(function () {
			var input = $(this), name = input.prop("name");
			if (!name) {
				return;
			}

			if (input.is(":radio")) {
				if (!!data.radio[name] && data.radio[name] === input.val()) {
					input.prop("checked", true);
				}
			} else if (input.is(":checkbox")) {
				if (!!data.checkbox[name] && -1 !== data.checkbox[name].indexOf(input.val())) {
					input.prop("checked", true);
				}
			} else {
				if (!!data.input[name]) {
					input.val(data.input[name]);
				}
			}
		});
	};

	// localStorage support
	$.fn[pluginName].supportLocalStorage = "object" === typeof window.localStorage;

	$.fn[pluginName].backupData = function (data) {
		if (!$.fn[pluginName].supportLocalStorage) {
			return;
		}

		window.localStorage.setItem(pluginName, JSON.stringify(data));
	};

	$.fn[pluginName].restoreData = function () {
		return JSON.parse(window.localStorage.getItem(pluginName));
	};

	$.fn[pluginName].clearData = function () {
		window.localStorage.removeItem(pluginName);
	};

})({
	restoreAtInit: true,
	backupAtLeave: true,
	clearOnSubmit: false
}, jQuery, window, document);
