/**
 * AST for meat.
 *
 * @author Manuel Leuenberger
 */

var maenulabs = maenulabs || {};
maenulabs.meat = maenulabs.meat || {};
maenulabs.meat.ast = maenulabs.meat.ast || {};

maenulabs.meat.ast.Node = new Class(
	Object,
	function () {
		Object.apply(this, []);
	},
	{
		accept: function (visitor) {
			throw new Error('abstract method');
		}
	});

maenulabs.meat.ast.StatementsNode = new Class(
	maenulabs.meat.ast.Node,
	function (statements) {
		maenulabs.meat.ast.Node.apply(this, []);
		this.statements = statements;
	},
	{
		accept: function (visitor) {
			visitor.visitStatementsNode(this);
		}
	});

maenulabs.meat.ast.StatementNode = new Class(
	maenulabs.meat.ast.Node,
	function () {
		maenulabs.meat.ast.Node.apply(this, []);
	},
	{
		
	});

maenulabs.meat.ast.MessageSendNode = new Class(
	maenulabs.meat.ast.StatementNode,
	function (expression, message) {
		maenulabs.meat.ast.StatementNode.apply(this, []);
		this.expression = expression;
		this.message = message;
	},
	{
		accept: function (visitor) {
			visitor.visitMessageSendNode(this);
		}
	});

maenulabs.meat.ast.CommentNode = new Class(
	maenulabs.meat.ast.StatementNode,
	function (lines) {
		maenulabs.meat.ast.StatementNode.apply(this, []);
		this.lines = lines;
	},
	{
		accept: function (visitor) {
			visitor.visitCommentNode(this);
		}
	});

maenulabs.meat.ast.LiteralNode = new Class(
	maenulabs.meat.ast.Node,
	function () {
		maenulabs.meat.ast.Node.apply(this, []);
	},
	{
		
	});

maenulabs.meat.ast.VariableNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function (identifier) {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
		this.identifier = identifier;
	},
	{
		accept: function (visitor) {
			visitor.visitVariableNode(this);
		}
	});

maenulabs.meat.ast.ObjectNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function () {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
	},
	{
		accept: function (visitor) {
			visitor.visitObjectNode(this);
		}
	});

maenulabs.meat.ast.BlockNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function (statements) {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
		this.statements = statements;
	},
	{
		accept: function (visitor) {
			visitor.visitBlockNode(this);    
		}
	});

maenulabs.meat.ast.CharacterNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function (character) {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
		this.character = character;
	},
	{
		accept: function (visitor) {
			visitor.visitCharacterNode(this);
		}
	});

maenulabs.meat.ast.StringNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function (string) {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
		this.string = string;
	},
	{
		accept: function (visitor) {
			visitor.visitStringNode(this);
		}
	});

maenulabs.meat.ast.NumberNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function (number) {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
		this.number = number;
	},
	{
		accept: function (visitor) {
			visitor.visitNumberNode(this);
		}
	});

maenulabs.meat.ast.ListNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function (elements) {
		maenulabs.meat.ast.LiteralNode.apply(this, []);
		this.elements = elements;
	},
	{
		accept: function (visitor) {
			visitor.visitListNode(this);
		}
	});

maenulabs.meat.ast.MessageNode = new Class(
	maenulabs.meat.ast.Node,
	function (selector) {
		maenulabs.meat.ast.Node.apply(this, []);
		this.selector = selector;
	},
	{
		accept: function (visitor) {
			visitor.visitMessageNode(this);
		}
	});

maenulabs.meat.ast.UnaryMessageNode = new Class(
	maenulabs.meat.ast.MessageNode,
	function (selector) {
		maenulabs.meat.ast.MessageNode.apply(this, [selector]);
	},
	{
		accept: function (visitor) {
			visitor.visitUnaryMessageNode(this);
		}
	});

maenulabs.meat.ast.BinaryMessageNode = new Class(
	maenulabs.meat.ast.MessageNode,
	function (selector, argument) {
		maenulabs.meat.ast.MessageNode.apply(this, [selector, argument]);
		this.argument = argument;
	},
	{
		accept: function (visitor) {
			visitor.visitBinaryMessageNode(this);
		}
	});

maenulabs.meat.ast.KeywordMessageNode = new Class(
	maenulabs.meat.ast.MessageNode,
	function (selector, arguments) {
		maenulabs.meat.ast.MessageNode.apply(this, [selector, arguments]);
		this.arguments = arguments
	},
	{
		accept: function (visitor) {
			visitor.visitKeywordMessageNode(this);
		}
	});