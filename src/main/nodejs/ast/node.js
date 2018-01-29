/**
 * AST nodes for meat.
 *
 * @author Manuel Leuenberger
 */

class Node {

	accept(visitor) {
		throw new Error('abstract method')
	}

}

class Statements extends Node {

	constructor(statements) {
		super()
		this.statements = statements
	}

	accept(visitor) {
		visitor.visitStatements(this)
	}

}

class Statement extends Node {
}

class Comment extends Statement {

	constructor(lines) {
		super()
		this.lines = lines
	}

	accept(visitor) {
		visitor.visitComment(this)
	}

}

class MessageSend extends Statement {

	constructor(receiver, message) {
		super()
		this.receiver = receiver
		this.message = message
	}

	accept(visitor) {
		visitor.visitMessageSend(this)
	}

}

class Message extends Node {

	constructor(selector) {
		super()
		this.selector = selector
	}

}

class UnaryMessage extends Message {

	accept(visitor) {
		visitor.visitUnaryMessage(this)
	}

}

class BinaryMessage extends Message {

	constructor(selector, parameter) {
		super(selector)
		this.parameter = parameter
	}

	accept(visitor) {
		visitor.visitBinaryMessage(this)
	}

}

class KeywordMessage extends Message {

	constructor(selector, parameters) {
		super(selector)
		this.parameters = parameters
	}

	accept(visitor) {
		visitor.visitKeywordMessage(this)
	}

}

class Literal extends Node {
}

class Variable extends Literal {

	constructor(name) {
		super()
		this.name = name
	}

	accept(visitor) {
		visitor.visitVariable(this)
	}

}

class Block extends Literal {

	constructor(statements) {
		super()
		this.statements = statements
	}

	accept(visitor) {
		visitor.visitBlock(this)
	}

}

class String extends Literal {

	constructor(string) {
		super()
		this.string = string
	}

	accept(visitor) {
		visitor.visitString(this)
	}

}

class Number extends Literal {

	constructor(number) {
		super()
		this.number = number
	}

	accept(visitor) {
		visitor.visitNumber(this)
	}

}

module.exports = {
	Node: Node,
	Statements: Statements,
	Statement: Statement,
	Comment: Comment,
	MessageSend: MessageSend,
	Message: Message,
	UnaryMessage: UnaryMessage,
	BinaryMessage: BinaryMessage,
	KeywordMessage: KeywordMessage,
	Literal: Literal,
	Variable: Variable,
	Block: Block,
	String: String,
	Number: Number
}
