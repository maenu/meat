const assert = require('assert')
const node = require('../../main/nodejs/ast/node')
const parser = require('../../main/nodejs/parser')

describe('parser', () => {

	let p

	before(() => {
		p = new parser.Parser({
			allowedStartRules: [
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
