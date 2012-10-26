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
	function() {
		
	},
	{
		accept: function(visitor) {
			throw new Error("Abstract method not implemented");
		}
	});

maenulabs.meat.ast.StatementsNode = new Class(
	maenulabs.meat.ast.Node,
	function(statements) {
		maenulabs.meat.ast.Node.apply(this, arguments);
		this.statements = statements;
	},
	{
		accept: function(visitor) {
			visitor.visitStatementsNode(this);
		}
	});

maenulabs.meat.ast.StatementNode = new Class(
	maenulabs.meat.ast.Node,
	function() {
		maenulabs.meat.ast.Node.apply(this, arguments);
	},
	{
		
	});

maenulabs.meat.ast.MessageSendNode = new Class(
	maenulabs.meat.ast.StatementNode,
	function(expression, message) {
		maenulabs.meat.ast.StatementNode.apply(this, arguments);
		this.expression = expression;
		this.message = message;
	},
	{
		accept: function(visitor) {
			visitor.visitMessageSendNode(this);
		}
	});

maenulabs.meat.ast.CommentNode = new Class(
	maenulabs.meat.ast.StatementNode,
	function(comment) {
		maenulabs.meat.ast.StatementNode.apply(this, arguments);
		this.comment = comment;
	},
	{
		accept: function(visitor) {
			visitor.visitCommentNode(this);
		}
	});

maenulabs.meat.ast.LiteralNode = new Class(
	maenulabs.meat.ast.Node,
	function() {
		maenulabs.meat.ast.Node.apply(this, arguments);
	},
	{
		
	});

maenulabs.meat.ast.BlockNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function(statements) {
		maenulabs.meat.ast.LiteralNode.apply(this, arguments);
		this.statements = statements;
	},
	{
		accept: function(visitor) {
			visitor.visitBlockNode(this);    
		}
	});

maenulabs.meat.ast.CharacterNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function(character) {
		maenulabs.meat.ast.LiteralNode.apply(this, arguments);
		this.character = character;
	},
	{
		accept: function(visitor) {
			visitor.visitCharacterNode(this);
		}
	});

maenulabs.meat.ast.StringNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function(string) {
		maenulabs.meat.ast.LiteralNode.apply(this, arguments);
		this.string = string;
	},
	{
		accept: function(visitor) {
			visitor.visitStringNode(this);
		}
	});

maenulabs.meat.ast.NumberNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function(number) {
		maenulabs.meat.ast.LiteralNode.apply(this, arguments);
		this.number = number;
	},
	{
		accept: function(visitor) {
			visitor.visitNumberNode(this);
		}
	});

maenulabs.meat.ast.ListNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function(expressions) {
		maenulabs.meat.ast.LiteralNode.apply(this, arguments);
		this.expressions = expressions;
	},
	{
		accept: function(visitor) {
			visitor.visitListNode(this);
		}
	});

maenulabs.meat.ast.VariableNode = new Class(
	maenulabs.meat.ast.LiteralNode,
	function(variable) {
		maenulabs.meat.ast.LiteralNode.apply(this, arguments);
		this.variable = variable;
	},
	{
		accept: function(visitor) {
			visitor.visitVariableNode(this);
		}
	});

maenulabs.meat.ast.MessageNode = new Class(
	maenulabs.meat.ast.Node,
	function() {
		maenulabs.meat.ast.Node.apply(this, arguments);
	},
	{
		
	});

maenulabs.meat.ast.UnaryMessageNode = new Class(
	maenulabs.meat.ast.MessageNode,
	function(selector) {
		maenulabs.meat.ast.MessageNode.apply(this, arguments);
		this.selector = selector;
	},
	{
		accept: function(visitor) {
			visitor.visitUnaryMessageNode(this);
		}
	});

maenulabs.meat.ast.BinaryMessageNode = new Class(
	maenulabs.meat.ast.MessageNode,
	function(selector, expression) {
		maenulabs.meat.ast.MessageNode.apply(this, arguments);
		this.selector = selector;
		this.expression = expression;
	},
	{
		accept: function(visitor) {
			visitor.visitBinaryMessageNode(this);
		}
	});

maenulabs.meat.ast.KeywordMessageNode = new Class(
	maenulabs.meat.ast.MessageNode,
	function(selector, expressions) {
		maenulabs.meat.ast.MessageNode.apply(this, arguments);
		this.selector = selector;
		this.expressions = expressions
	},
	{
		accept: function(visitor) {
			visitor.visitKeywordMessageNode(this);
		}
	});