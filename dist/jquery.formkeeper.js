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
		}, defaults, options);

		if ("string" === typeof this.options.formId) {
			this.formId = this.options.formId;
		} else if ("string" === typeof $(this.element).data("formid")) {
			// $.data not retrieve HTML5 data-* https://api.jquery.com/jquery.data/
			this.formId =  $(this.element).data("formid");
		} else {
			this.formId = location.pathname.replace(/\//g, "_");
		}
		this.namespace = pluginName + "." + this.formId;

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
				$(window).on("beforeunload." + this.namespace, function () {
					that.backup();
				});
			}

			if (this.options.clearOnSubmit) {
				this.element.on("submit." + this.namespace, function () {
					that.clear();
				});
			}
		},
		destroy: function () {
			if (this.options.backupAtLeave) {
				$(window).off("beforeunload." + this.namespace);
			}

			if (this.options.clearOnSubmit) {
				this.element.off("submit." + this.namespace);
			}
		},

		backup: function () {
			this.options.backupData(this.formId, this.options.backupForm(this.element));
		},

		restore: function () {
			var data = this.options.restoreData(this.formId);
			if (!!data) {
				this.options.restoreForm(this.element, data);
			}
		},

		clear: function () {
			this.options.clearData(this.formId);
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

	$.fn[pluginName].backupData = function (formId, data) {
		if (!$.fn[pluginName].supportLocalStorage) {
			return;
		}

		window.localStorage.setItem(pluginName + "." + formId, JSON.stringify(data));
	};

	$.fn[pluginName].restoreData = function (formId) {
		return JSON.parse(window.localStorage.getItem(pluginName + "." + formId));
	};

	$.fn[pluginName].clearData = function (formId) {
		window.localStorage.removeItem(pluginName + "." + formId);
	};

})({
	restoreAtInit: true,
	backupAtLeave: true,
	clearOnSubmit: false
}, jQuery, window, document);
