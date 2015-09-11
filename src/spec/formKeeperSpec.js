/* jshint quotmark: single */

// add new matcher
beforeEach(function () {
	jasmine.addMatchers({
		toBeFunction: function () {
			return {
				compare: function (actual) {
					return {
						pass: '[object Function]' === Object.prototype.toString.call(actual)
					};
				}
			};
		}
	});
});

describe('Basic test suit', function () {
	it('should has formKeeper fn', function () {
		expect($.fn.formKeeper).toBeFunction();
	});

	it('should has formKeeper default backup/restore function', function () {
		expect($.fn.formKeeper.backupForm).toBeFunction();
		expect($.fn.formKeeper.restoreForm).toBeFunction();
		expect($.fn.formKeeper.backupData).toBeFunction();
		expect($.fn.formKeeper.restoreData).toBeFunction();
		expect($.fn.formKeeper.clearData).toBeFunction();
	});
});

describe('LocalStorage function test', function () {
	it('should support LocalStorage', function () {
		expect($.fn.formKeeper.supportLocalStorage).toBe(true);
	});

	it('should backup/restore correct data', function () {
		var data = { test: 1, from: 'jasmine' }, formId = 'jasmine-test';
		$.fn.formKeeper.backupData(formId, data);
		expect($.fn.formKeeper.restoreData(formId)).toEqual(data);
	});
});

describe('Form data test', function () {
	var form;

	beforeEach(function () {
		form = $('<form />').data('formid', 'jasmine');
	});

	it('should backup/restore simple text data', function () {
		var input = $('<input type="text" name="text-input" />').appendTo(form),
		    value = 'value-1', data;
		input.val(value);

		// initial form
		expect(input.val()).toEqual(value);

		// backup form
		data = $.fn.formKeeper.backupForm(form);

		// reset form
		form.trigger('reset');
		expect(input.val()).toEqual('');

		// restore form
		$.fn.formKeeper.restoreForm(form, data);
		expect(input.val()).toEqual(value);
	});

	it('should backup/restore radio data', function () {
		var input1 = $('<input type="radio" name="radio-input" value="1">').appendTo(form),
		    input2 = $('<input type="radio" name="radio-input" value="2">').appendTo(form),
		    data;

		// initial form
		expect(input1.prop('checked')).toEqual(false);
		expect(input2.prop('checked')).toEqual(false);

		// change input status
		input1.prop('checked', true);

		// backup form
		data = $.fn.formKeeper.backupForm(form);

		// reset form
		form.trigger('reset');
		expect(input1.prop('checked')).toEqual(false);
		expect(input2.prop('checked')).toEqual(false);

		// restore form
		$.fn.formKeeper.restoreForm(form, data);
		expect(input1.prop('checked')).toEqual(true);
		expect(input2.prop('checked')).toEqual(false);
	});

	it('should backup/restore checkbox data', function () {
		var input1 = $('<input type="checkbox" name="checkbox-input[]" value="1">').appendTo(form),
		    input2 = $('<input type="checkbox" name="checkbox-input[]" value="2">').appendTo(form),
		    data;

		// initial form
		expect(input1.prop('checked')).toEqual(false);
		expect(input2.prop('checked')).toEqual(false);

		// change input status
		input1.prop('checked', true);
		input2.prop('checked', true);

		// backup form
		data = $.fn.formKeeper.backupForm(form);

		// reset form
		form.trigger('reset');
		expect(input1.prop('checked')).toEqual(false);
		expect(input2.prop('checked')).toEqual(false);

		// restore form
		$.fn.formKeeper.restoreForm(form, data);
		expect(input1.prop('checked')).toEqual(true);
		expect(input2.prop('checked')).toEqual(true);
	});

	it('should backup/restore select data', function () {
		var input = $('<select name="select-input"><option>1</option><option value="2">two</option><option selected>3</option></select>').appendTo(form),
				initial_value = '3',
				value = '1',
		    data;

		// initial form
		expect(input.val()).toEqual(initial_value);

		// change form
		input.val(value);

		// backup form
		data = $.fn.formKeeper.backupForm(form);

		// reset form
		form.trigger('reset');
		expect(input.val()).toEqual(initial_value);

		// restore form
		$.fn.formKeeper.restoreForm(form, data);
		expect(input.val()).toEqual(value);
	});

	it('should backup/restore select(multiple) data', function () {
		var input = $('<select name="select-input" multiple><option selected>1</option><option value="2">two</option><option selected>3</option></select>').appendTo(form),
		    data;

		// initial form
		expect(input.val()).toContain('1');
		expect(input.val()).not.toContain('2');
		expect(input.val()).toContain('3');

		// change form
		input.val(['1', '2']);

		// backup form
		data = $.fn.formKeeper.backupForm(form);

		// reset form
		form.trigger('reset');
		expect(input.val()).toContain('1');
		expect(input.val()).not.toContain('2');
		expect(input.val()).toContain('3');

		// restore form
		$.fn.formKeeper.restoreForm(form, data);
		expect(input.val()).toContain('1');
		expect(input.val()).toContain('2');
		expect(input.val()).not.toContain('3');
	});
});
