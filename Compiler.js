/**
 * JavaScript compiler for meat.
 *
 * @author Manuel Leuenberger
 */

var maenulabs = maenulabs || {};
maenulabs.meat = maenulabs.meat || {};
maenulabs.meat.compiler = maenulabs.meat.compiler || {};

maenulabs.meat.compiler.Compiler = new Class(
	Object,
	function() {
		Object.apply(this, arguments);
		this.source = "";
	},
	{
		compile: function(ast) {
			this.source = "";
			ast.accept(this);
			return this.source;
		},
		visitStatementsNode: function(node) {
			for(var i = 0; i < node.statements.length; i++) {
				node.statements[i].accept(this);
				this.source += ";\n";
			}
		},
		visitMessageSendNode: function(node) {
			this.source += "(";
			node.expression.accept(this);
			this.source += ").";
			node.message.accept(this);
		},
		visitCommentNode: function(node) {
			if (node.comment.split("\n").length > 1) {
				this.source += "/*\n"
				this.source += node.comment;
				this.source += "\n*/";
			} else {
				this.source += "// ";
				this.source += node.comment;
			}
		},
		visitBlockNode: function(node) {
			this.source += "function() {";
			for(var i = 0; i < node.statements.length; i++) {
				node.statements[i].accept(this);
			}
			this.source += "}";
		},
		visitCharacterNode: function(node) {
			this.source += "\"" + node.character + "\"";
		},
		visitStringNode: function(node) {
			this.source += "\"" + node.string + "\"";
		},
		visitNumberNode: function(node) {
			this.source += node.number;
		},
		visitListNode: function(node) {
			this.source += "[";
			for(var i = 0; i < node.expressions.length; i++) {
				if (i > 0) {
					this.source += ", ";
				}
				node.expressions[i].accept(this);
			}
			this.source += "]";
		},
		visitVariableNode: function(node) {
			this.source += node.variable;
		},
		visitUnaryMessageNode: function(node) {
			this.source += "respondTo(";
			this.source += "\"" + node.selector + "\", ";
			this.source += "[], ";
			this.source += "this";
			this.source += ")";
		},
		visitBinaryMessageNode: function(node) {
			this.source += "respondTo(";
			this.source += "\"" + node.selector + "\", ";
			this.source += "[";
			node.expression.accept(this);
			this.source += "], ";
			this.source += "this";
			this.source += ")";
		},
		visitKeywordMessageNode: function(node) {
			this.source += "respondTo(";
			this.source += "\"" + node.selector + "\", ";
			this.source += "[";
			for(var i = 0; i < node.expressions.length; i++) {
				if (i > 0) {
					this.source += ", ";
				}
				node.expressions[i].accept(this);
			}
			this.source += "], ";
			this.source += "this";
			this.source += ")";
		}
	});