/**
 * JavaScript compiler for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.compiler = meat.compiler || {};

meat.compiler.Compiler = new Class(
	Object,
	function () {
		Object.apply(this, arguments);
	},
	{
		compile: function (ast) {
			var visitor = new meat.compiler.AstVisitor();
			ast.accept(visitor);
			return visitor.source;
		}
	});

meat.compiler.AstVisitor = new Class(
	Object,
	function () {
		Object.apply(this, arguments);
		this.source = '';
	},
	{
		visitStatementsNode: function (node) {
			for (var i = 0; i < node.statements.length - 1; i++) {
				node.statements[i].accept(this);
				this.source += ';\n';
			}
			this.source += 'return ';
			node.statements[node.statements.length - 1].accept(this);
			this.source += ';\n';
		},
		visitCommentNode: function (node) {
			this.source += 'new meat.model.Comment(new meat.model.List([';
			for (var i = 0; i < node.lines.length - 1; i++) {
				this.source += 'new meat.model.String(\'';
				this.source += node.lines[i];
				this.source += '\'), ';
			}
			this.source += 'new meat.model.String(\'';
			this.source += node.lines[node.lines.length - 1];
			this.source += '\')';
			this.source += '])';
		},
		visitMessageSendNode: function (node) {
			this.source += 'interpreter.interpret(';
			node.message.accept(this);
			this.source += ', ';
			node.expression.accept(this);
			this.source += ', context)';
		},
		visitVariableNode: function (node) {
			this.source += 'new meat.model.Variable(new meat.model.String(\'';
			this.source += node.identifier;
			this.source += '\'))';
		},
		visitBlockNode: function (node) {
			this.source += 'new meat.model.Block(function (context) {\n';
			node.statements.accept(this);
			this.source += '})';
		},
		visitCharacterNode: function (node) {
			this.source += 'new meat.model.Character(\'';
			this.source += node.character
			this.source += '\')';
		},
		visitStringNode: function (node) {
			this.source += 'new meat.model.String(\'';
			this.source += node.string
			this.source += '\')';
		},
		visitNumberNode: function (node) {
			this.source += 'new meat.model.Number('
			this.source += node.number
			this.source += ')';
		},
		visitListNode: function (node) {
			this.source += 'new meat.model.List([';
			for (var i = 0; i < node.elements.length; i++) {
				if (i > 0) {
					this.source += ', ';
				}
				node.elements[i].accept(this);
			}
			this.source += '])';
		},
		visitUnaryMessageNode: function (node) {
			this.source += 'new meat.model.String(\'' + node.selector + '\')';
			this.source += ', new meat.model.List([]), this';
		},
		visitBinaryMessageNode: function (node) {
			this.source += 'new meat.model.String(\'' + node.selector + '\')';
			this.source += ', new meat.model.List([';
			node.argument.accept(this);
			this.source += ']), this';
		},
		visitKeywordMessageNode: function (node) {
			this.source += 'new meat.model.String(\'' + node.selector + '\')';
			this.source += ', new meat.model.List([';
			for (var i = 0; i < node.arguments.length; i++) {
				if (i > 0) {
					this.source += ', ';
				}
				node.arguments[i].accept(this);
			}
			this.source += ']), this';
		}
	});