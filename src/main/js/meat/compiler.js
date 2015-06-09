/**
 * JavaScript compiler for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.compiler = meat.compiler || {};

var Type = ch.maenulabs.type.Type;

meat.compiler.Compiler = new Type(Object, {
	initialize: function () {
		this.source = '';
	},
	compile: function (ast) {
		this.source = '';
		var visitor = new meat.compiler.Visitor(this);
		this.append('function () {\n');
		this.append('var context = new meat.vm.model.Context(null, null);\n');
		ast.accept(visitor);
		this.append('}\n');
		return this.source;
	},
	append: function (string) {
		this.source = this.source + string;
	}
});

meat.compiler.Visitor = new Type(meat.ast.visitor.DepthFirst, {
	initialize: function (compiler) {
		this.base('initialize')();
		this.compiler = compiler;
	},
	append: function (string) {
		this.compiler.append(string);
	},
	visitStatements: function (node) {
		var statements = node.getStatements();
		for (var i = 0; i < statements.length - 1; i = i + 1) {
			statements[i].accept(this);
			this.append(';\n');
		}
		this.append('return ');
		statements[statements.length - 1].accept(this);
		this.append(';\n');
	},
	visitComment: function (node) {
		this.append('new meat.vm.model.Comment([');
		var lines = node.getLines();
		for (var i = 0; i < lines.length - 1; i = i + 1) {
			this.append('\'');
			this.append(lines[i]);
			this.append('\', ');
		}
		this.append('\'');
		this.append(lines[lines.length - 1]);
		this.append('\'])');
	},
	visitMessageSend: function (node) {
		this.append('(');
		node.getReceiver().accept(this);
		this.append(').respondTo(');
		node.getMessage().accept(this);
		this.append(')');
	},
	visitUnaryMessage: function (node) {
		this.append('\'');
		this.append(node.selector);
		this.append('\', [], context');
	},
	visitBinaryMessage: function (node) {
		this.append('\'');
		this.append(node.selector);
		this.append('\', [');
		this.base('visitBinaryMessage')(node);
		this.append('], context');
	},
	visitKeywordMessage: function (node) {
		this.append('\'');
		this.append(node.selector);
		this.append('\', [');
		var parameters = node.getParameters();
		for (var i = 0; i < parameters.length - 1; i = i + 1) {
			parameters[i].accept(this);
			this.append(', ');
		}
		parameters[parameters.length - 1].accept(this);
		this.append('], context');
	},
	visitVariable: function (node) {
		this.append('context.respondTo(\'at:\', [\'');
		this.append(node.getName());
		this.append('\'], context)');
	},
	visitBlock: function (node) {
		this.append('new meat.vm.model.Block(function (selector, parameters, context) {\n');
		this.base('visitBlock')(node);
		this.append('})');
	},
	visitCharacter: function (node) {
		this.append('new meat.vm.model.Character(\'');
		this.append(node.character);
		this.append('\')');
	},
	visitString: function (node) {
		this.append('new meat.vm.model.String(\'');
		this.append(node.string);
		this.append('\')');
	},
	visitNumber: function (node) {
		this.append('new meat.vm.model.Number(');
		this.append(node.getNumber());
		this.append(')');
	},
	visitList: function (node) {
		this.append('new meat.vm.model.List([');
		var items = node.getItems();
		for (var i = 0; i < items.length - 1; i = i + 1) {
			items[i].accept(this);
			this.append(', ');
		}
		items[items.length - 1].accept(this);
		this.append('])');
	}
});
