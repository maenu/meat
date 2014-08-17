/**
 * AST for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.ast = meat.ast || {};

var Type = ch.maenulabs.type.Type;

meat.ast.Node = new Type(Object, {
	accept: function(visitor) {
		throw new Error('abstract method');
	}
});

meat.ast.LiteralNode = new Type(meat.ast.Node);

meat.ast.MessageNode = new Type(meat.ast.Node, {
	initialize: function(selector) {
		this.base('initialize')();
		this.selector = selector;
	},
	accept: function(visitor) {
		visitor.visitMessageNode(this);
	}
});

meat.ast.StatementNode = new Type(meat.ast.Node);

meat.ast.StatementsNode = new Type(meat.ast.Node, {
	initialize: function(statements) {
		this.base('initialize')();
		this.statements = statements;
	},
	accept: function(visitor) {
		visitor.visitStatementsNode(this);
	}
});

meat.ast.MessageSendNode = new Type(meat.ast.StatementNode, {
	initialize: function(expression, message) {
		this.base('initialize')();
		this.expression = expression;
		this.message = message;
	},
	accept: function(visitor) {
		visitor.visitMessageSendNode(this);
	}
});

meat.ast.CommentNode = new Type(meat.ast.StatementNode, {
	initialize: function(lines) {
		this.base('initialize')();
		this.lines = lines;
	},
	accept: function(visitor) {
		visitor.visitCommentNode(this);
	}
});

meat.ast.VariableNode = new Type(meat.ast.LiteralNode, {
	initialize: function(identifier) {
		this.base('initialize')();
		this.identifier = identifier;
	},
	accept: function(visitor) {
		visitor.visitVariableNode(this);
	}
});

meat.ast.BlockNode = new Type(meat.ast.LiteralNode, {
	initialize: function(statements) {
		this.base('initialize')();
		this.statements = statements;
	},
	accept: function(visitor) {
		visitor.visitBlockNode(this);
	}
});

meat.ast.CharacterNode = new Type(meat.ast.LiteralNode, {
	initialize: function(character) {
		this.base('initialize')();
		this.character = character;
	},
	accept: function(visitor) {
		visitor.visitCharacterNode(this);
	}
});

meat.ast.StringNode = new Type(meat.ast.LiteralNode, {
	initialize: function(string) {
		this.base('initialize')();
		this.string = string;
	},
	accept: function(visitor) {
		visitor.visitStringNode(this);
	}
});

meat.ast.NumberNode = new Type(meat.ast.LiteralNode, {
	initialize: function(number) {
		this.base('initialize')();
		this.number = number;
	},
	accept: function(visitor) {
		visitor.visitNumberNode(this);
	}
});

meat.ast.ListNode = new Type(meat.ast.LiteralNode, {
	initialize: function(elements) {
		this.base('initialize')();
		this.elements = elements;
	},
	accept: function(visitor) {
		visitor.visitListNode(this);
	}
});

meat.ast.UnaryMessageNode = new Type(meat.ast.MessageNode, {
	initialize: function(selector) {
		this.base('initialize')(selector);
	},
	accept: function(visitor) {
		visitor.visitUnaryMessageNode(this);
	}
});

meat.ast.BinaryMessageNode = new Type(meat.ast.MessageNode, {
	initialize: function(selector, argument) {
		this.base('initialize')(selector);
		this.argument = argument;
	},
	accept: function(visitor) {
		visitor.visitBinaryMessageNode(this);
	}
});

meat.ast.KeywordMessageNode = new Type(meat.ast.MessageNode, {
	initialize: function(selector, arguments) {
		this.base('initialize')(selector);
		this.arguments = arguments
	},
	accept: function(visitor) {
		visitor.visitKeywordMessageNode(this);
	}
});
