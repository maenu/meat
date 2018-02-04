class MeatObject {

	constructor(oracle) {
		this.oracle = oracle
		this.oracle.methods['oracle'] = (parameters, context) => {
			return this.oracle
		}
		this.oracle.methods['oracle:'] = (parameters, context) => {
			this.oracle = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context)
			return this
		}
		this.oracle.methods['respondsTo:'] = (parameters, context) => {
			let selector = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).string
			return new MeatBoolean(new MeatOracle(), this.oracle.methods.hasOwnProperty(selector))
		}
	}

	respondTo(selector, parameters, context) {
		// console.log(this.constructor.name, selector, parameters.toString())
		return this.oracle.respondTo(selector, parameters, context)
	}

	toString() {
		return '@Object'
	}

}

class MeatOracle extends MeatObject {

	constructor() {
		super({
			methods: {}
		})
		this.oracle = this
		this.methods = {}
		this.methods['oracle'] = (parameters, context) => {
			return this.oracle
		}
		this.methods['oracle:'] = (parameters, context) => {
			this.oracle = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context)
			return this
		}
		this.oracle.methods['respondsTo:'] = (parameters, context) => {
			let selector = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).string
			return new MeatBoolean(new MeatOracle(), this.oracle.methods.hasOwnProperty(selector))
		}
	}

	respondTo(selector, parameters, context) {
		// console.log(this.constructor.name, selector, parameters.toString())
		if (this.oracle === this) {
			let self = context.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatString(new MeatOracle(), 'self')
			]), context)
			return this.methods[selector].apply(self, [parameters, context])
		}
		return super.respondTo(selector, parameters, context)
	}

	toString() {
		return '@Oracle'
	}

}

class MeatContext extends MeatObject {

	constructor(oracle, self, parent, isolated) {
		super(oracle)
		this.parent = parent
		this.isolated = isolated
		this.variables = {}
		this.variables['context'] = this
		this.variables['self'] = self
		this.oracle.methods['newOracle'] = (parameters, context) => {
			return new MeatOracle()
		}
		this.oracle.methods['newContextBelow'] = (parameters, context) => {
			context = new MeatContext(new MeatOracle(), null, context, false)
			this.variables['self'] = new MeatVariable(new MeatOracle(), context)
			return context
		}
		this.oracle.methods['newIsolatedContextBelow'] = (parameters, context) => {
			context = new MeatContext(new MeatOracle(), null, context, true)
			this.variables['self'] = new MeatVariable(new MeatOracle(), context)
			return context
		}
		this.oracle.methods['at:'] = (parameters, context) => {
			let name = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).string
			let c = this
			while (c && !c.variables[name]) {
				c = c.parent
			}
			if (c) {
				return c.variables[name]
			}
			let object = new MeatVariable(new MeatOracle(), new MeatObject(new MeatOracle()))
			this.variables[name] = object
			return object
		}
		this.oracle.methods['at:put:'] = (parameters, context) => {
			let name = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).string
			let object = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 2)
			]), context)
			if (!(object instanceof MeatVariable)) {
				object = new MeatVariable(new MeatOracle(), object)
			}
			if (!this.isolated) {
				let c = this
				while (c && !c.variables[name]) {
					c = c.parent
				}
				if (c) {
					c.variables[name] = object
					return object
				}
			}
			this.variables[name] = object
			return object
		}
	}

	respondTo(selector, parameters, context) {
		// console.log(this.constructor.name, selector, parameters.toString())
		// FIXME can we get rid of this?
		if (selector == 'at:' && parameters.items[0].string == 'self') {
			return this.variables['self']
		}
		return super.respondTo(selector, parameters, context)
	}

	toString() {
		return '@Context'
	}

}

class MeatBlock extends MeatObject {

	constructor(oracle, parameters, f) {
		super(oracle)
		this.parameters = parameters
		this.f = (parameters, context) => {
			this.parameters.forEach((parameter, i) => {
				context.respondTo('at:put:', new MeatList(new MeatOracle(), [
					new MeatString(new MeatOracle(), parameter),
					parameters.respondTo('at:', new MeatList(new MeatOracle(), [
						new MeatNumber(new MeatOracle(), i + 1)
					]), context)
				]), context)
			})
			return f.apply(this, [parameters, context])
		}
		this.oracle.methods['evaluateIn:'] = (parameters, context) => {
			context = context.respondTo('newContextBelow', new MeatList(new MeatOracle(), []), context)
			return this.f.apply(this, [parameters, context])
		}
		this.oracle.methods['evaluate:'] = (parameters, context) => {
			context = context.respondTo('newIsolatedContextBelow', new MeatList(new MeatOracle(), []), context)
			return this.f.apply(this, [parameters, context])
		}
		this.oracle.methods['evaluate'] = (parameters, context) => {
			context = context.respondTo('newIsolatedContextBelow', new MeatList(new MeatOracle(), []), context)
			return this.f.apply(this, [parameters, context])
		}
	}

	toString() {
		return '@Block'
	}

}

class MeatVariable extends MeatObject {

	constructor(oracle, object) {
		super(oracle)
		this.object = object
		this.oracle.methods['object'] = (parameters, context) => {
			return this.object
		}
		this.oracle.methods['object:'] = (parameters, context) => {
			this.object = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context)
			return this
		}
		this.oracle.methods[':='] = (parameters, context) => {
			return this.respondTo('object:', parameters, context)
		}
	}

	respondTo(selector, parameters, context) {
		// console.log(this.constructor.name, selector, parameters.toString())
		if (this.object.respondTo('respondsTo:', new MeatList(new MeatOracle(), [
				new MeatString(new MeatOracle(), selector)
			]), context).boolean) {
			return this.object.respondTo(selector, parameters, context)
		}
		return super.respondTo(selector, parameters, context)
	}

	toString() {
		return `$${this.object.toString()}`
	}

}

class MeatString extends MeatObject {

	constructor(oracle, string) {
		super(oracle)
		this.string = string
	}

	toString() {
		return `'${this.string}'`
	}

}

class MeatComment extends MeatString {

}

class MeatNumber extends MeatObject {

	constructor(oracle, number) {
		super(oracle)
		this.number = number
		this.oracle.methods['+'] = (parameters, context) => {
			let summand = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).number
			return new MeatNumber(new MeatOracle(), this.number + summand)
		}
		this.oracle.methods['-'] = (parameters, context) => {
			let minuend = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).number
			return new MeatNumber(new MeatOracle(), this.number - minuend)
		}
		this.oracle.methods['<='] = (parameters, context) => {
			let comparand = parameters.respondTo('at:', new MeatList(new MeatOracle(), [
				new MeatNumber(new MeatOracle(), 1)
			]), context).number
			return new MeatBoolean(new MeatOracle(), this.number <= comparand)
		}
	}

	toString() {
		return this.number.toString()
	}

}

class MeatBoolean extends MeatObject {

	constructor(oracle, boolean) {
		super(oracle)
		this.boolean = boolean
		this.oracle.methods['ifTrue:ifFalse:'] = (parameters, context) => {
			if (this.boolean) {
				return parameters.respondTo('at:', new MeatList(new MeatOracle(), [
					new MeatNumber(new MeatOracle(), 1)
				]), context).respondTo('evaluateIn:', new MeatList(new MeatOracle(), [
					context
				]), context)
			} else {
				return parameters.respondTo('at:', new MeatList(new MeatOracle(), [
					new MeatNumber(new MeatOracle(), 2)
				]), context).respondTo('evaluateIn:', new MeatList(new MeatOracle(), [
					context
				]), context)
			}
		}
	}

	toString() {
		return this.boolean.toString()
	}

}

class MeatList extends MeatObject {

	constructor(oracle, items) {
		super(oracle)
		this.items = items
		this.oracle.methods['at:'] = (parameters, context) => {
			let index = parameters.items[0].number - 1
			let object = this.items[index] || new MeatObject(new MeatOracle())
			this.items[index] = object
			return object
		}
		this.oracle.methods['at:put:'] = (parameters, context) => {
			let index = parameters.items[0].number - 1
			this.items[index] = parameters.items[1]
			return this
		}
	}

	toString() {
		return `[${this.items.toString()}]`
	}

}

module.exports = {
	MeatObject: MeatObject,
	MeatOracle: MeatOracle,
	MeatVariable: MeatVariable,
	MeatContext: MeatContext,
	MeatBlock: MeatBlock,
	MeatString: MeatString,
	MeatNumber: MeatNumber,
	MeatList: MeatList,
	MeatComment: MeatComment
}
