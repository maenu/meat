const assert = require('assert')
const parser = require('../../main/nodejs/parser')
const compiler = require('../../main/nodejs/compiler')
const model = require('../../main/nodejs/vm/model')

let parser_ = new parser.Parser()
let compiler_ = new compiler.Compiler()
let meatCompile = (source) => {
	let f = compiler_.compile(parser_.parse(source))
	return () => f(model)
}

describe.only('compiler', () => {

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
			assert.equal(meatCompile(s)().string, e)
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
			assert.equal(meatCompile(s)().string, e)
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
			return meatCompile(s)
		}
		
		let jsFibonacci = (n) => {
			if (n <= 1) {
				return 1
			}
			return jsFibonacci(n - 2) + jsFibonacci(n - 1)
		}

		it('should compile fibonacci', () => {
			assert.equal(meatFibonacci(0)().number, 1)
			assert.equal(meatFibonacci(1)().number, 1)
			assert.equal(meatFibonacci(2)().number, 2)
			assert.equal(meatFibonacci(3)().number, 3)
			assert.equal(meatFibonacci(4)().number, 5)
			assert.equal(meatFibonacci(5)().number, 8)
			assert.equal(meatFibonacci(6)().number, 13)
			assert.equal(meatFibonacci(7)().number, 21)
			assert.equal(meatFibonacci(8)().number, 34)
			assert.equal(meatFibonacci(9)().number, 55)
			assert.equal(meatFibonacci(10)().number, 89)
		})

		it('should compile fibonacci', function () {
			this.timeout(600000)
			let meatFibonacci25 = meatFibonacci(25)
			for (let i = 0; i < 10; i = i + 1) {
				let before = new Date()
				let result = meatFibonacci25().number
				let after = new Date()
				console.log(`meat-js,fibonacci(25),${i},${after.getTime() - before.getTime()},${result}`)
				assert.equal(result, 121393)
			}
			for (let i = 0; i < 10; i = i + 1) {
				let before = new Date()
				let result = jsFibonacci(25)
				let after = new Date()
				console.log(`js,fibonacci(25),${i},${after.getTime() - before.getTime()},${result}`)
				assert.equal(result, 121393)
			}
		})

	})

})
