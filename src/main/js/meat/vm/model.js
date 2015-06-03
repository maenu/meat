/**
 * JavaScript virtual machine model for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.vm = meat.vm || {};
meat.vm.model = meat.vm.model || {};

var Type = ch.maenulabs.type.Type;

meat.vm.model.Object = new Type(Object, {
	intitialize: function () {
		this.base('initialize')();
		this.oracle = new meat.vm.model.Oracle();
		this.oracle.register('oracle', (function (context) {
			return this.oracle;
		}).bind(this));
		this.oracle.register('oracle:', (function (context) {
			var parameters = context.respondTo('parameters', [], context);
			this.oracle = parameters.respondTo('at:', [1], context);
			return this;
		}).bind(this));
	},
	respondTo: function (selector, parameters, context) {
		context = context.respondTo('newContextExtending:selector:parameters:receiver:', [context, selector, parameters, this], context);
		context.respondTo('at:put:', ['this', this], context);
		return this.oracle.respondTo(selector, parameters, context);
	}
});

meat.vm.model.Oracle = new Type(meat.vm.model.Object, {
	intitialize: function (methods) {
		this.base('initialize')();
		if (methods === undefined) {
			methods = {};
		}
		this.methods = methods;
	},
	respondTo: function (selector, parameters, context) {
		var receiver = context.respondTo('receiver', [], context);
		return this.methods[selector].apply(receiver, [context]);
	},
	register: function (selector, f) {
		this.methods[selector] = f;
	},
	getMethods: function () {
		return this.methods;
	}
});

meat.vm.model.VariableOracle = new Type(meat.vm.model.Oracle, {
	respondTo: function (selector, parameters, context) {
		if (this.methods[selector] !== undefined) {
			return this.base('respondTo')(selector, parameters, context);
		} else {
			var variable = context.respondTo('at:', ['this'], context);
			var object = variable.respondTo('object', [], context);
			return object.respondTo(selector, parameters, context);
		}
	}
});

meat.vm.model.Variable = new Type(meat.vm.model.Object, {
	intitialize: function () {
		this.base('initialize')();
		this.object = new meat.vm.model.Object();
		this.oracle = new meat.vm.model.VariableOracle(this.oracle.getMethods());
		this.oracle.register('object', (function (context) {
			return this.object;
		}).bind(this));
		this.oracle.register('object:', (function (context) {
			var parameters = context.respondTo('parameters', [], context);
			var object = parameters.respondTo('at:', [1], context);
			this.object = object;
			return this;
		}).bind(this));
	}
});

meat.vm.model.Context = new Type(meat.vm.model.Object, {
	intitialize: function () {
		this.base('initialize')();
		this.parent = new meat.vm.model.Object();
		this.selector = new meat.vm.model.Object();
		this.parameters = new meat.vm.model.Object();
		this.receiver = new meat.vm.model.Object();
		this.variables = {};
		this.oracle.register('parent', (function (context) {
			return this.parent;
		}).bind(this));
		this.oracle.register('selector', (function (context) {
			return this.selector;
		}).bind(this));
		this.oracle.register('parameters', (function (context) {
			return this.parameters;
		}).bind(this));
		this.oracle.register('receiver', (function (context) {
			return this.receiver;
		}).bind(this));
		this.oracle.register('newContextExtending:selector:parameters:receiver:', (function (context) {
			var parameters = context.respondTo('parameters', [], context);
			this.parent = parameters.respondTo('at:', [1], context);
			this.selector = parameters.respondTo('at:', [2], context);
			this.parameters = parameters.respondTo('at:', [3], context);
			this.receiver = parameters.respondTo('at:', [4], context);
			return this;
		}).bind(this));
		this.oracle.register('at:', (function (context) {
			var parameters = context.respondTo('parameters', [], context);
			var name = parameters.respondTo('at:', [1], context);
			return this.variables[name];
		}).bind(this));
		this.oracle.register('at:put:', (function (context) {
			var parameters = context.respondTo('parameters', [], context);
			var name = parameters.respondTo('at:', [1], context);
			var object = parameters.respondTo('at:', [2], context);
			var variable = (this.variables[name] !== undefined)
					? this.variables[name]
					: context.respondTo('newVariable', [], context);
			this.variables[name] = variable;
			variable.respondTo('object:', [object], context);
			return this;
		}).bind(this));
	}
});

meat.vm.model.Block = new Type(meat.vm.model.Object, {
	intitialize: function (f) {
		this.base('initialize')();
		this.f = f;
		this.oracle.register('runIn:', (function (context) {
			return this.f.apply(this, [context]);
		}).bind(this));
	}
});
