/**
 * JavaScript compiler for meat.
 *
 * @author Manuel Leuenberger
 */

const visitor = require('./ast/visitor')

class Compiler {

	compile(ast) {
		this.source = ''
		let visitor = new Visitor(this)
		this.append('function () {\n')
		this.append('let context = new model.MeatContext(null, null);\n')
		ast.accept(visitor)
		this.append('}\n')
		return this.source
	}

	append(string) {
		this.source = this.source + string
	}

}

class Visitor extends visitor.DepthFirst {

	constructor(compiler) {
		super()
		this.compiler = compiler
	}

	append(string) {
		this.compiler.append(string)
	}

	visitStatements(node) {
		for (let i = 0; i < node.statements.length - 1; i = i + 1) {
			node.statements[i].accept(this)
			this.append(';\n')
		}
		this.append('return ')
		node.statements[node.statements.length - 1].accept(this)
		this.append(';\n')
	}

	visitComment(node) {
		this.append('new model.MeatComment([')
		for (let i = 0; i < node.lines.length - 1; i = i + 1) {
			this.append('\'')
			this.append(node.lines[i])
			this.append('\', ')
		}
		this.append('\'')
		this.append(node.lines[node.lines.length - 1])
		this.append('\'])')
	}

	visitMessageSend(node) {
		this.append('(')
		node.receiver.accept(this)
		this.append(').respondTo(')
		node.message.accept(this)
		this.append(')')
	}

	visitUnaryMessage(node) {
		this.append('\'')
		this.append(node.selector)
		this.append('\', [], context')
	}

	visitBinaryMessage(node) {
		this.append('\'')
		this.append(node.selector)
		this.append('\', [')
		super.visitBinaryMessage(node)
		this.append('], context')
	}

	visitKeywordMessage(node) {
		this.append('\'')
		this.append(node.selector)
		this.append('\', [')
		for (let i = 0; i < node.parameters.length - 1; i = i + 1) {
			node.parameters[i].accept(this)
			this.append(', ')
		}
		node.parameters[node.parameters.length - 1].accept(this)
		this.append('], context')
	}

	visitVariable(node) {
		this.append('context.respondTo(\'at:\', [\'')
		this.append(node.identifier)
		this.append('\'], context)')
	}

	visitBlock(node) {
		this.append('new model.MeatBlock(function (selector, parameters, context) {\n')
		super.visitBlock(node)
		this.append('})')
	}

	visitString(node) {
		this.append('new model.MeatString(\'')
		this.append(node.string)
		this.append('\')')
	}

	visitNumber(node) {
		this.append('new model.MeatNumber(')
		this.append(node.number)
		this.append(')')
	}

}

module.exports = {
	Compiler: Compiler,
	Visitor: Visitor
}
