const visitor = require('./ast/visitor')

class Compiler {

	compile(ast) {
		this.source = ''
		let visitor = new Visitor(this)
		this.append('() => {\n')
		this.append('let context = new model.MeatContext(null, false);\n')
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
		this.append('new model.MeatComment(\'')
		this.append(node.lines.join('\n'))
		this.append('\')')
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
		this.append('\', new model.MeatList([]), context')
	}

	visitBinaryMessage(node) {
		this.append('\'')
		this.append(node.selector)
		this.append('\', new model.MeatList([')
		super.visitBinaryMessage(node)
		this.append(']), context')
	}

	visitKeywordMessage(node) {
		this.append('\'')
		this.append(node.selector)
		this.append('\', new model.MeatList([')
		for (let i = 0; i < node.parameters.length - 1; i = i + 1) {
			node.parameters[i].accept(this)
			this.append(', ')
		}
		node.parameters[node.parameters.length - 1].accept(this)
		this.append(']), context')
	}

	visitVariable(node) {
		this.append('context.respondTo(\'at:\', new model.MeatList([new model.MeatString(\'')
		this.append(node.identifier)
		this.append('\')]), context)')
	}

	visitBlock(node) {
		this.append('new model.MeatBlock([')
		this.append(node.parameters.map((parameter) => {
			return `'${parameter}'`
		}).join(', '))
		this.append('], (parameters, context) => {\n')
		super.visitBlock(node)
		this.append('\n})')
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

	visitBoolean(node) {
		this.append('new model.MeatBoolean(')
		this.append(node.boolean)
		this.append(')')
	}

	visitList(node) {
		this.append('new model.MeatList([\n')
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
