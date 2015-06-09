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
	initialize: function () {
		this.oracle = new meat.vm.model.Oracle();
		this.oracle.register('oracle', function (selector, parameters, context) {
			return this.oracle;
		});
		this.oracle.register('oracle:', function (selector, parameters, context) {
			this.oracle = parameters[0];
			return this;
		});
	},
	respondTo: function (selector, parameters, context) {
		context = context.respondTo('newContextBelow:receivedBy:', [context, this], context);
		return this.oracle.respondTo(selector, parameters, context, this);
	}
});

meat.vm.model.Oracle = new Type(Object, {
	initialize: function () {
		this.methods = {};
	},
	respondTo: function (selector, parameters, context, receiver) {
		return this.methods[selector].apply(receiver, [selector, parameters, context]);
	},
	register: function (selector, f) {
		this.methods[selector] = f;
	},
	getMethods: function () {
		return this.methods;
	}
});

meat.vm.model.VariableOracle = new Type(meat.vm.model.Oracle, {
	respondTo: function (selector, parameters, context, receiver) {
		if (this.methods[selector] !== undefined) {
			return this.base('respondTo')(selector, parameters, context, receiver);
		}
		var variable = context.respondTo('at:', ['this'], context);
		var object = variable.respondTo('object', [], context);
		return object.respondTo(selector, parameters, context);
	}
});

meat.vm.model.Variable = new Type(meat.vm.model.Object, {
	initialize: function () {
		this.base('initialize')();
		this.object = new meat.vm.model.Object();
		this.oracle = new meat.vm.model.VariableOracle(this.oracle.getMethods());
		this.oracle.register('object', function (selector, parameters, context) {
			return this.object;
		});
		this.oracle.register('object:', function (selector, parameters, context) {
			var object = parameters[0];
			this.object = object;
			return this;
		});
	}
});

meat.vm.model.Context = new Type(meat.vm.model.Object, {
	initialize: function (parent, receiver) {
		this.base('initialize')();
		this.parent = parent;
		this.receiver = receiver;
		this.variables = {};
		this.variables['context'] = this;
		this.variables['this'] = this.receiver;
		// bind to this since we bypass recursion
		this.oracle.register('newContextBelow:receivedBy:', (function (selector, parameters, context) {
			return new meat.vm.model.Context(parameters[0], parameters[1]);
		}).bind(this));
		this.oracle.register('newVariable', (function (selector, parameters, context) {
			return new meat.vm.model.Variable();
		}).bind(this));
		this.oracle.register('at:', (function (selector, parameters, context) {
			var name = parameters[0];
			return this.variables[name];
		}).bind(this));
		this.oracle.register('at:put:', (function (selector, parameters, context) {
			var name = parameters[0];
			var object = parameters[1];
			var variable = (this.variables[name] !== undefined)
					? this.variables[name]
					: context.respondTo('newVariable', [], context);
			this.variables[name] = variable;
			variable.respondTo('object:', [object], context);
			return this;
		}).bind(this));
	},
	respondTo: function (selector, parameters, context) {
		// bypass recursion
		return this.oracle.respondTo(selector, parameters, context, this.receiver);
	}
});

meat.vm.model.Block = new Type(meat.vm.model.Object, {
	initialize: function (f) {
		this.base('initialize')();
		this.f = f;
		this.oracle.register('runIn:', function (selector, parameters, context) {
			return this.f.apply(this, [selector, parameters, context]);
		});
	}
});

meat.vm.model.Character = new Type(meat.vm.model.Object, {
	initialize: function (character) {
		this.base('initialize')();
		this.character = character;
	}
});

meat.vm.model.String = new Type(meat.vm.model.Object, {
	initialize: function (string) {
		this.base('initialize')();
		this.string = string;
	}
});

meat.vm.model.Number = new Type(meat.vm.model.Object, {
	initialize: function (number) {
		this.base('initialize')();
		this.number = number;
		this.oracle.register('+', function (selector, parameters, context) {
			var summand = parameters[0];
			return new meat.vm.model.Number(this.number + summand.number);
		});
	}
});

meat.vm.model.List = new Type(meat.vm.model.Object, {
	initialize: function (list) {
		this.base('initialize')();
		this.list = list;
		this.oracle.register('at:', function (selector, parameters, context) {
			var index = parameters[0];
			return this.list[index];
		});
		this.oracle.register('at:put:', function (selector, parameters, context) {
			var index = parameters[0];
			var value = parameters[1];
			this.list[index] = value;
			return this;
		});
	}
});
