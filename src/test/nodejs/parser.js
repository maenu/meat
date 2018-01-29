const assert = require('assert')
const node = require('../../main/nodejs/ast/node')
const parser = require('../../main/nodejs/parser')

describe('parser', () => {

	let p

	before(() => {
		p = new parser.Parser({
			allowedStartRules: [
				'number'
			]
		})
	})

	describe('literal', () => {

		it('number', () => {
			let n = p.parse('1', {
				startRule: 'number'
			})
			assert.ok(n instanceof node.Number)
		})

	})

})
