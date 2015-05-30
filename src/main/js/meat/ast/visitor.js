/**
 * AST visitor for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.ast = meat.ast || {};
meat.ast.visitor = meat.ast.visitor || {};

var Type = ch.maenulabs.type.Type;

meat.ast.visitor.DepthFirst = new Type(Object, {
	visitStatements: function (node) {
		var statements = node.getStatements();
		for (var i = 0; i < statements.length; i = i + 1) {
			statements[i].accept(this);
		}
	},
	visitComment: function (node) {
		
	},
	visitMessageSend: function (node) {
		node.getReceiver().accept(this);
		node.getMessage().accept(this);
	},
	visitUnaryMessage: function (node) {
		
	},
	visitBinaryMessage: function (node) {
		node.getParameter().accept(this);
	},
	visitKeywordMessage: function (node) {
		var parameters = node.getParameters();
		for (var i = 0; i < parameters.length; i = i + 1) {
			parameters[i].accept(this);
		}
	},
	visitVariable: function (node) {
		
	},
	visitBlock: function (node) {
		node.getStatements().accept(this);
	},
	visitCharacter: function (node) {
		
	},
	visitString: function (node) {
		
	},
	visitNumber: function (node) {
		
	},
	visitList: function (node) {
		var items = node.getItems();
		for (var i = 0; i < items.length; i = i + 1) {
			items[i].accept(this);
		}
	}
});
