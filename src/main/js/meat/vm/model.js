/**
 * JavaScript virtual machine model for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.vm.model = meat.vm.model || {};

var Type = ch.maenulabs.type.Type;

meat.vm.model.Oracle = new Type(Object, {
	intitialize: function () {
		this.methods = {};
	},
	respondTo: function (selector, parameters, context) {
		return this.methods[selector].apply(this, [context])
	}
});

meat.vm.model.Object = new Type(Object, {
	intitialize: function () {
		this.oracle = new meat.vm.model.Oracle();
		this.oracle.methods['oracle'] = function (context) {
			return this.oracle;
		};
		this.oracle.methods['oracle:'] = function (context) {
			var parameters = context.respondTo('at:', ['parameters'], context);
			this.oracle = parameters.respondTo('at:', [0], context);
			return this;
		}
	},
	respondTo: function (selector, parameters, context) {
		context.respondTo('at:put:', ['selector', selector], context);
		context.respondTo('at:put:', ['parameters', parameters], context);
		context.respondTo('at:put:', ['this', this], context);
		return this.oracle.respondTo('runIn:', [context], context);
	}
});

meat.vm.model.Block = new Type(meat.vm.model.Object, {
	intitialize: function (block) {
		this.base('initialize')();
		this.block = block;
		this.context = null;
		this.oracle.methods['in:'] = function (context) {
			this.context = context;
			return this;
		};
		this.oracle.methods['runIn:'] = function (context) {
			return this.block.apply(this, [context]);
		};
		this.oracle.methods['run'] = function (context) {
			return this.block.apply(this, [this.context]);
		};
	}
});

meat.vm.model.Dictionary = new Type(meat.vm.model.Object, {
	intitialize: function () {
		this.base('initialize')();
		this.map = {};
		this.oracle.methods['at:'] = function (context) {
			var parameters = context.respondTo('at:', ['parameters'], context);
			var name = parameters.respondTo('at:', [1], context);
			return this.map[name];
		};
		this.oracle.methods['at:put:'] = function (context) {
			var parameters = context.respondTo('at:', ['parameters'], context);
			var name = parameters.respondTo('at:', [1], context);
			var value = parameters.respondTo('at:', [2], context);
			this.map[name] = value;
			return this;
		};
	}
});

meat.vm.model.Variable = new Type(meat.vm.model.Object, {
	intitialize: function (identifier) {
		this.base('initialize')();
		this.identifier = identifier;
		this.value = null;
		this.oracle.methods['value'] = function (context) {
			return this.value;
		};
		this.oracle.methods['value:'] = function (context) {
			var parameters = context.respondTo('at:', ['parameters'], context);
			var name = parameters.respondTo('at:', [1], context);
			this.map[name] = value;
			return this;
		};
	}
});

meat.vm.model.Interpreter = new Type(Object, {
	interpret: function (selector, parameters, receiver, context) {
		if (selector == ':=') {
			context;
		}
		return receiver.respondTo(selector, parameters, context);
	}
});
