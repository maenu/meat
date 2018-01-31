const assert = require('assert')
const node = require('../../main/nodejs/ast/node')
const parser = require('../../main/nodejs/parser')

describe('parser', () => {

	let p

	before(() => {
		p = new parser.Parser({
			allowedStartRules: [
				'goal',
				'statements',
				'statement',
				'comment',
				'messageSend',
				'expression',
				'message',
				'unary',
				'binary',
				'keyword',
				'literal',
				'variable',
				'block',
				'string',
				'number',
				'identifier'
			]
		})
	})

	describe('goal', () => {

		let parses = (text) => {
			it('parses ' + text, () => {
				let n = p.parse(text)
				assert.ok(n instanceof node.Statements)
			})
		}
		let doesNotParse = (text) => {
			it('does not parse ' + text, () => {
				assert.throws(() => {
					p.parse(text)
				}, 'SyntaxError')
			})
		}

		parses(`"
	This is a fibonacci program.
"
f := {
	(i <= 1) ifTrue: {
		1
	} ifFalse: {
		(f run: (i - 2)) + (f run: (i - 1))
	}
}
`)

	})

	describe('message', () => {

		describe('unary', () => {

			let parses = (text) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'message'
					})
					assert.ok(n instanceof node.UnaryMessage)
					assert.equal(n.selector, text.substring(1))
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'message'
						})
					}, 'SyntaxError')
				})
			}

			parses(' a')
			parses(' a1')
			parses(' asdf')
			parses(' asdf123')
			parses(' asGECsddd345sd2t4x')
			doesNotParse(' 0')
			doesNotParse(' a ')
			doesNotParse(' vegetable')
			doesNotParse(' ä')
			doesNotParse(' ')

		})

		describe('binary', () => {

			let parses = (text) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'message'
					})
					assert.ok(n instanceof node.BinaryMessage)
					assert.equal(n.selector, text.split(' ')[1])
					assert.ok(n.parameter instanceof node.Number)
					assert.equal(n.parameter.number, 1)
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'message'
						})
					}, 'SyntaxError')
				})
			}

			parses(' + 1')
			parses(' +- 1')
			parses(' +*/<>:=.- 1')
			doesNotParse(' 0 1')
			doesNotParse(' a 1')
			doesNotParse(' + 1 ')

		})

		describe('keyword', () => {

			let parses = (text) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'message'
					})
					assert.ok(n instanceof node.KeywordMessage)
					assert.equal(n.selector, text.replace(/ 1/g, '').replace(/ /g, ''))
					assert.equal(n.parameters.length, n.selector.split(':').length - 1)
					n.parameters.forEach((parameter) => {
						assert.ok(parameter instanceof node.Number)
						assert.equal(parameter.number, 1)
					})
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'message'
						})
					}, 'SyntaxError')
				})
			}

			parses(' a: 1')
			parses(' a1: 1')
			parses(' asdf: 1')
			parses(' asdf123: 1')
			parses(' asGECsddd345sd2t4x: 1 ajlhakljsdhfSDV2: 1')
			doesNotParse(' a:')
			doesNotParse(' a: 1 ')
			doesNotParse(' ä: 1')

		})

	})

	describe('literal', () => {

		describe('variable', () => {

			let parses = (text) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'variable'
					})
					assert.ok(n instanceof node.Variable)
					assert.equal(n.identifier, text)
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'variable'
						})
					}, 'SyntaxError')
				})
			}

			parses('a')
			parses('a1')
			parses('asdf')
			parses('asdf123')
			parses('asGECsddd345sd2t4x')
			doesNotParse('0')
			doesNotParse('a ')
			doesNotParse('vegetable')
			doesNotParse('ä')
			doesNotParse(' ')

		})

		describe('block', () => {

			let parses = (text, l) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'block'
					})
					assert.ok(n instanceof node.Block)
					assert.equal(n.statements.statements.length, l)
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'block'
						})
					}, 'SyntaxError')
				})
			}

			parses('{}', 0)
			parses('{\n\t1 negative\n}', 1)
			parses('{\n\t1 negative\n\t2 positive\n}', 2)
			doesNotParse('{')
			doesNotParse('}')
			doesNotParse('{\t1 negative\n}')
			doesNotParse('{\n1 negative\n}')
			doesNotParse('{\n\t1 negative}')

		})

		describe('string', () => {

			let parses = (text) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'string'
					})
					assert.ok(n instanceof node.String)
					assert.equal(n.string, text.substring(1, text.length - 1))
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'string'
						})
					}, 'SyntaxError')
				})
			}

			parses('\'\'')
			parses('\'a\'')
			parses('\'14351 lkj alöksjf\'')
			parses('\'14351 l\n\tkj \n\ralöksjf\'')
			doesNotParse('\'')
			doesNotParse('\'as df')
			doesNotParse('asdf\'')

		})

		describe('number', () => {

			let parses = (text) => {
				it('parses ' + text, () => {
					let n = p.parse(text, {
						startRule: 'number'
					})
					assert.ok(n instanceof node.Number)
					assert.equal(n.number, parseFloat(text))
				})
			}
			let doesNotParse = (text) => {
				it('does not parse ' + text, () => {
					assert.throws(() => {
						p.parse(text, {
							startRule: 'number'
						})
					}, 'SyntaxError')
				})
			}

			parses('0')
			parses('0.123')
			parses('1')
			parses('12')
			parses('12.345')
			doesNotParse('0.')
			doesNotParse('01')
			doesNotParse('01.234')
			doesNotParse('-1')

		})

	})

})
