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
		this.append('let context = new model.MeatContext(new model.MeatOracle(), this);\n')
		this.append('context.variables[\'self\'] = context;\n')
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
	}

	visitComment(node) {
		this.append('new model.MeatComment(new model.MeatOracle(), [')
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
		// FIXME this is broken, should be handled by context
		if (node.message.selector == ':=') {
			this.append('context.respondTo(\'at:put:\', [new model.MeatString(new model.MeatOracle(), \'')
			this.append(node.receiver.identifier)
			this.append('\'), ')
			node.message.parameter.accept(this)
			this.append('], context)')
		} else {
			this.append('(')
			node.receiver.accept(this)
			this.append(').respondTo(')
			node.message.accept(this)
			this.append(')')
		}
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
		this.append('context.respondTo(\'at:\', [new model.MeatString(new model.MeatOracle(), \'')
		this.append(node.identifier)
		this.append('\')], context)')
	}

	visitBlock(node) {
		this.append('new model.MeatBlock(new model.MeatOracle(), [')
		this.append(node.parameters.map((parameter) => {
			return `'${parameter}'`
		}).join(', '))
		this.append('], function (parameters, context) {\n')
		super.visitBlock(node)
		this.append('\n})')
	}

	visitString(node) {
		this.append('new model.MeatString(new model.MeatOracle(), \'')
		this.append(node.string)
		this.append('\')')
	}

	visitNumber(node) {
		this.append('new model.MeatNumber(new model.MeatOracle(), ')
		this.append(node.number)
		this.append(')')
	}

	visitBoolean(node) {
		this.append('new model.MeatBoolean(new model.MeatOracle(), ')
		this.append(node.boolean)
		this.append(')')
	}

	visitList(node) {
		this.append('new model.MeatList(new model.MeatOracle(), [\n')
		for (let i = 0; i < node.statements.statements.length - 1; i = i + 1) {
			node.statements.statements[i].accept(this)
			this.append(',\n')
		}
		node.statements.statements[node.statements.statements.length - 1].accept(this)
		this.append('\n])')
	}

}

module.exports = {
	Compiler: Compiler,
	Visitor: Visitor
}
