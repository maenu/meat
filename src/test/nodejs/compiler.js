const assert = require('assert')
const parser = require('../../main/nodejs/parser')
const compiler = require('../../main/nodejs/compiler')

describe.only('compiler', () => {

	let p
	let c

	before(() => {
		p = new parser.Parser()
		c = new compiler.Compiler()
	})

	let fibonacci = (n) => {
		let s = `"
	This is a fibonacci program.
"
f := [ i
	(i <= 1) ifTrue: [
		1
	] ifFalse: [
		(f evaluate: (i - 2)) + (f evaluate: (i - 1))
	]
]
f evaluate: ${n}
`
		let text = c.compile(p.parse(s))
		return eval(`const model = require('../../main/nodejs/vm/model');(${text})()`).number
	}

	it('should compile fibonacci', () => {
		assert.equal(fibonacci(0), 1)
		assert.equal(fibonacci(1), 1)
		assert.equal(fibonacci(2), 2)
		assert.equal(fibonacci(3), 3)
		assert.equal(fibonacci(4), 5)
		assert.equal(fibonacci(5), 8)
		assert.equal(fibonacci(6), 13)
	})

})
