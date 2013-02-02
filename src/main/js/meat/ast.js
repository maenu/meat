/**
 * AST for meat.
 *
 * @author Manuel Leuenberger
 */

var meat = meat || {};
meat.ast = meat.ast || {};

meat.ast.Node = new Class(
	Object,
	function () {
		Object.apply(this, []);
	},
	{
		accept: function (visitor) {
			throw new Error('abstract method');
		}
	});

meat.ast.StatementsNode = new Class(
	meat.ast.Node,
	function (statements) {
		meat.ast.Node.apply(this, []);
		this.statements = statements;
	},
	{
		accept: function (visitor) {
			visitor.visitStatementsNode(this);
		}
	});

meat.ast.StatementNode = new Class(
	meat.ast.Node,
	function () {
		meat.ast.Node.apply(this, []);
	},
	{
		
	});

meat.ast.MessageSendNode = new Class(
	meat.ast.StatementNode,
	function (expression, message) {
		meat.ast.StatementNode.apply(this, []);
		this.expression = expression;
		this.message = message;
	},
	{
		accept: function (visitor) {
			visitor.visitMessageSendNode(this);
		}
	});

meat.ast.CommentNode = new Class(
	meat.ast.StatementNode,
	function (lines) {
		meat.ast.StatementNode.apply(this, []);
		this.lines = lines;
	},
	{
		accept: function (visitor) {
			visitor.visitCommentNode(this);
		}
	});

meat.ast.LiteralNode = new Class(
	meat.ast.Node,
	function () {
		meat.ast.Node.apply(this, []);
	},
	{
		
	});

meat.ast.VariableNode = new Class(
	meat.ast.LiteralNode,
	function (identifier) {
		meat.ast.LiteralNode.apply(this, []);
		this.identifier = identifier;
	},
	{
		accept: function (visitor) {
			visitor.visitVariableNode(this);
		}
	});

meat.ast.BlockNode = new Class(
	meat.ast.LiteralNode,
	function (statements) {
		meat.ast.LiteralNode.apply(this, []);
		this.statements = statements;
	},
	{
		accept: function (visitor) {
			visitor.visitBlockNode(this);    
		}
	});

meat.ast.CharacterNode = new Class(
	meat.ast.LiteralNode,
	function (character) {
		meat.ast.LiteralNode.apply(this, []);
		this.character = character;
	},
	{
		accept: function (visitor) {
			visitor.visitCharacterNode(this);
		}
	});

meat.ast.StringNode = new Class(
	meat.ast.LiteralNode,
	function (string) {
		meat.ast.LiteralNode.apply(this, []);
		this.string = string;
	},
	{
		accept: function (visitor) {
			visitor.visitStringNode(this);
		}
	});

meat.ast.NumberNode = new Class(
	meat.ast.LiteralNode,
	function (number) {
		meat.ast.LiteralNode.apply(this, []);
		this.number = number;
	},
	{
		accept: function (visitor) {
			visitor.visitNumberNode(this);
		}
	});

meat.ast.ListNode = new Class(
	meat.ast.LiteralNode,
	function (elements) {
		meat.ast.LiteralNode.apply(this, []);
		this.elements = elements;
	},
	{
		accept: function (visitor) {
			visitor.visitListNode(this);
		}
	});

meat.ast.MessageNode = new Class(
	meat.ast.Node,
	function (selector) {
		meat.ast.Node.apply(this, []);
		this.selector = selector;
	},
	{
		accept: function (visitor) {
			visitor.visitMessageNode(this);
		}
	});

meat.ast.UnaryMessageNode = new Class(
	meat.ast.MessageNode,
	function (selector) {
		meat.ast.MessageNode.apply(this, [selector]);
	},
	{
		accept: function (visitor) {
			visitor.visitUnaryMessageNode(this);
		}
	});

meat.ast.BinaryMessageNode = new Class(
	meat.ast.MessageNode,
	function (selector, argument) {
		meat.ast.MessageNode.apply(this, [selector, argument]);
		this.argument = argument;
	},
	{
		accept: function (visitor) {
			visitor.visitBinaryMessageNode(this);
		}
	});

meat.ast.KeywordMessageNode = new Class(
	meat.ast.MessageNode,
	function (selector, arguments) {
		meat.ast.MessageNode.apply(this, [selector, arguments]);
		this.arguments = arguments
	},
	{
		accept: function (visitor) {
			visitor.visitKeywordMessageNode(this);
		}
	});