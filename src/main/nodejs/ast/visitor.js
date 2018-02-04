/**
 * AST visitor for meat.
 *
 * @author Manuel Leuenberger
 */

class DepthFirst {

	visitStatements(node) {
		for (let i = 0; i < node.statements.length; i = i + 1) {
			node.statements[i].accept(this)
		}
	}

	visitComment(node) {

	}

	visitMessageSend(node) {
		node.receiver.accept(this)
		node.message.accept(this)
	}

	visitUnaryMessage(node) {

	}

	visitBinaryMessage(node) {
		node.parameter.accept(this)
	}

	visitKeywordMessage(node) {
		for (let i = 0; i < node.parameters.length; i = i + 1) {
			node.parameters[i].accept(this)
		}
	}

	visitVariable(node) {

	}

	visitBlock(node) {
		node.statements.accept(this)
	}

	visitString(node) {

	}

	visitNumber(node) {

	}

	visitBoolean(node) {

	}

	visitList(node) {
		node.statements.accept(this)
	}

}

module.exports = {
	DepthFirst: DepthFirst
}
