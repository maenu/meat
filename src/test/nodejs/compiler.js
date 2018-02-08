const assert = require('assert')
const parser = require('../../main/nodejs/parser')
const compiler = require('../../main/nodejs/compiler')

describe.only('compiler', () => {

	let p
	let c
	let i

	before(() => {
		p = new parser.Parser()
		c = new compiler.Compiler()
		i = (s) => {
			let text = c.compile(p.parse(s))
			console.debug(text)
			return eval(`const model = require('../../main/nodejs/vm/model');(${text})()`)
		}
	})

	describe('oracle', ()=>{

		it('should be impolite', () => {
			let s = `(o object) oracle: [
	'nah!'
]
o hello
`
			let e = 'nah!'
			console.log('>>>')
			console.log(s)
			console.log('<<<')
			console.log(e)
			assert.equal(i(s).string, e)
		})

		it('should be polite', () => {
			let s = `(o object) oracle: [ selector
	(selector = 'hello') ifTrue: [
		'hi!'
	] ifFalse: [
		'nah!'
	]
]
o hello
`
			let e = 'hi!'
			console.log('>>>')
			console.log(s)
			console.log('<<<')
			console.log(e)
			assert.equal(i(s).string, e)
		})

	})

	describe('fibonacci', () => {

		let meatFibonacci = (n) => {
			let s = `"
	This is a fibonacci program.
"
f object: [ i
	(i <= 1) ifTrue: [
		1
	] ifFalse: [
		(f evaluateWith: {
			i - 2
		} in: (context newIsolatedContextBelow)) + (f evaluateWith: {
			i - 1
		} in: (context newIsolatedContextBelow))
	]
]
f evaluateWith: {
	${n}
} in: context
`
			return i(s).number
		}
		let javaScriptFibonacci = (n) => {
			if (n <= 1) {
				return 1
			}
			return javaScriptFibonacci(n - 2) + javaScriptFibonacci(n - 1)
		}

		it('should compile fibonacci', () => {
			assert.equal(meatFibonacci(0), 1)
			assert.equal(meatFibonacci(1), 1)
			assert.equal(meatFibonacci(2), 2)
			assert.equal(meatFibonacci(3), 3)
			assert.equal(meatFibonacci(4), 5)
			assert.equal(meatFibonacci(5), 8)
			assert.equal(meatFibonacci(6), 13)
			assert.equal(meatFibonacci(7), 21)
			assert.equal(meatFibonacci(8), 34)
			assert.equal(meatFibonacci(9), 55)
			assert.equal(meatFibonacci(10), 89)
		})

		it('should compile fibonacci', function () {
			this.timeout(30000)
			let before = new Date()
			assert.equal(javaScriptFibonacci(18), 4181)
			let after = new Date()
			console.log(`took ${after.getTime() - before.getTime()}ms`)
		})

		it('should compile fibonacci', function () {
			this.timeout(30000)
			let before = new Date()
			assert.equal(meatFibonacci(18), 4181)
			let after = new Date()
			console.log(`took ${after.getTime() - before.getTime()}ms`)
		})

	})

})
