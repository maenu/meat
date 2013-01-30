/**
 * JavaScript model for meat.
 *
 * @author Manuel Leuenberger
 */

var maenulabs = maenulabs || {};
maenulabs.meat = maenulabs.meat || {};
maenulabs.meat.model = maenulabs.meat.model || {};

maenulabs.meat.model.Oracle = new Class(
	Object,
	function () {
		Object.apply(this, arguments);
		this.methods = [];
	}, {
		respondTo: function (selector, arguments, sender, context) {
			return this.methods[selector].apply(this, [context])
		}
	});

maenulabs.meat.model.Object = new Class(
	Object,
	function () {
		Object.apply(this, arguments);
		this.oracle = new maenulabs.meat.model.Oracle();
		this.oracle.methods['oracle'] = function (context) {
			return this.oracle
		};
		this.oracle.methods['oracle:'] = function (context) {
			// use interpreter instead of context
			var arguments = context.respondTo('at:', ['arguments'], sender, context);
			var receiver = context.respondTo('at:', ['receiver'], sender, context);
			receiver.oracle = arguments[0];
			return receiver;
		};
	},
	{
		respondTo: function (selector, arguments, sender, context) {
			context.respondTo('at:put:', ['selector', selector], sender, context);
			context.respondTo('at:put:', ['arguments', arguments], sender, context);
			context.respondTo('at:put:', ['sender', sender], sender, context);
			context.respondTo('at:put:', ['receiver', this], sender, context);
			return this.oracle.respondTo('runIn:', [context], sender, context);
		}
	});

maenulabs.meat.model.Block = new Class(
	maenulabs.meat.model.Object,
	function (block) {
		maenulabs.meat.model.Object.apply(this, arguments);
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
			return this.block.apply(this, [this.context || context]);
		};
	}, {
		
	});
	
maenulabs.meat.model.Dictionary = new Class(
	maenulabs.meat.model.Object,
	function () {
		maenulabs.meat.model.Object.apply(this, arguments);
		this.map = {};
		this.oracle.methods['at:'] = function (context) {
			var arguments = context.respondTo('at:', ['arguments'], this, context);
			var name = arguments.respondTo('at:', [1], this, context);
			return this.map[name];
		};
		this.oracle.methods['at:put:'] = function (context) {
			var arguments = context.respondTo('at:', ['arguments'], this, context);
			var name = arguments.respondTo('at:', [1], this, context);
			var value = arguments.respondTo('at:', [2], this, context);
			this.map[name] = value;
			return this;
		};
	}, {
		
	});

maenulabs.meat.model.Variable = new Class(
	maenulabs.meat.model.Object,
	function (identifier) {
		maenulabs.meat.model.Object.apply(this, arguments);
		this.identifier = identifier;
		this.value = null;
		this.oracle.methods['value'] = function (context) {
			return this.value;
		};
		this.oracle.methods['value:'] = function (context) {
			var arguments = context.respondTo('at:', ['arguments'], this, context);
			var name = arguments.respondTo('at:', [1], this, context);
			this.map[name] = value;
			return this;
		};
	}, {
		
	});

maenulabs.meat.model.Interpreter = new Class(
	Object,
	function () {
		Object.apply(this, arguments);
	}, {
		interpret: function (selector, arguments, sender, receiver, context) {
			if (selector == ':=') {
				context;
			}
			return receiver.respondTo(selector, arguments, sender, context);
		}
	});