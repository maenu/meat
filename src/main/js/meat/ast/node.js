/**
 * AST nodes for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.ast = meat.ast || {};
meat.ast.node = meat.ast.node || {};

var Type = ch.maenulabs.type.Type;

meat.ast.node.Abstract = new Type(Object, {
	accept: function (visitor) {
		throw new Error('abstract method');
	}
});

meat.ast.node.Statements = new Type(meat.ast.node.Abstract, {
	initialize: function (statements) {
		this.base('initialize')();
		this.statements = statements;
	},
	accept: function (visitor) {
		visitor.visitStatements(this);
	},
	getStatements: function () {
		return this.statements;
	}
});

meat.ast.node.AbstractStatement = new Type(meat.ast.node.Abstract);

meat.ast.node.Comment = new Type(meat.ast.node.AbstractStatement, {
	initialize: function (lines) {
		this.base('initialize')();
		this.lines = lines;
	},
	accept: function (visitor) {
		visitor.visitComment(this);
	},
	getLines: function () {
		return this.lines;
	}
});

meat.ast.node.MessageSend = new Type(meat.ast.node.AbstractStatement, {
	initialize: function (receiver, message) {
		this.base('initialize')();
		this.receiver = receiver;
		this.message = message;
	},
	accept: function (visitor) {
		visitor.visitMessageSend(this);
	},
	getReceiver: function () {
		return this.receiver;
	},
	getMessage: function () {
		return this.message;
	}
});

meat.ast.node.AbstractMessage = new Type(meat.ast.node.Abstract, {
	initialize: function (selector) {
		this.base('initialize')();
		this.selector = selector;
	},
	getSelector: function () {
		return this.selector;
	}
});

meat.ast.node.UnaryMessage = new Type(meat.ast.node.AbstractMessage, {
	initialize: function (selector) {
		this.base('initialize')(selector);
	},
	accept: function (visitor) {
		visitor.visitUnaryMessage(this);
	}
});

meat.ast.node.BinaryMessage = new Type(meat.ast.node.AbstractMessage, {
	initialize: function (selector, parameter) {
		this.base('initialize')(selector);
		this.parameter = parameter;
	},
	accept: function (visitor) {
		visitor.visitBinaryMessage(this);
	},
	getParameter: function () {
		return this.parameter;
	}
});

meat.ast.node.KeywordMessage = new Type(meat.ast.node.AbstractMessage, {
	initialize: function (selector, parameters) {
		this.base('initialize')(selector);
		this.parameters = parameters
	},
	accept: function (visitor) {
		visitor.visitKeywordMessage(this);
	},
	getParameters: function () {
		return this.parameters;
	}
});

meat.ast.node.AbstractLiteral = new Type(meat.ast.node.Abstract);

meat.ast.node.Variable = new Type(meat.ast.node.AbstractLiteral, {
	initialize: function (name) {
		this.base('initialize')();
		this.name = name;
	},
	accept: function (visitor) {
		visitor.visitVariable(this);
	},
	getName: function () {
		return this.name;
	}
});

meat.ast.node.Block = new Type(meat.ast.node.AbstractLiteral, {
	initialize: function (statements) {
		this.base('initialize')();
		this.statements = statements;
	},
	accept: function (visitor) {
		visitor.visitBlock(this);
	},
	getStatements: function () {
		return this.statements;
	}
});

meat.ast.node.Character = new Type(meat.ast.node.AbstractLiteral, {
	initialize: function (character) {
		this.base('initialize')();
		this.character = character;
	},
	accept: function (visitor) {
		visitor.visitCharacter(this);
	},
	getCharacter: function () {
		return this.character;
	}
});

meat.ast.node.String = new Type(meat.ast.node.AbstractLiteral, {
	initialize: function (string) {
		this.base('initialize')();
		this.string = string;
	},
	accept: function (visitor) {
		visitor.visitString(this);
	},
	getString: function () {
		return this.string;
	}
});

meat.ast.node.Number = new Type(meat.ast.node.AbstractLiteral, {
	initialize: function (number) {
		this.base('initialize')();
		this.number = number;
	},
	accept: function (visitor) {
		visitor.visitNumber(this);
	},
	getNumber: function () {
		return this.number;
	}
});

meat.ast.node.List = new Type(meat.ast.node.AbstractLiteral, {
	initialize: function (items) {
		this.base('initialize')();
		this.items = items;
	},
	accept: function (visitor) {
		visitor.visitList(this);
	},
	getItems: function () {
		return this.items;
	}
});
