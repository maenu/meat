/**
 * JavaScript virtual machine model for meat.
 *
 * @author Manuel Leuenberger
 */

class MeatObject {

	constructor(oracle) {
		this.oracle = oracle
		this.oracle.methods['oracle'] = (parameters, context) => {
			return this.oracle
		}
		this.oracle.methods['oracle:'] = (parameters, context) => {
			this.oracle = parameters[0]
			return this
		}
	}

	respondTo(selector, parameters, context) {
		//console.log(this.constructor.name, selector, parameters, context.variables)
		return this.oracle.respondTo(selector, parameters, context)
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
			this.oracle = parameters[0]
			return this
		}
	}

	respondTo(selector, parameters, context) {
		if (this.oracle === this) {
			let self = context.respondTo('at:', [new MeatString(new MeatOracle(), 'self')], context)
			return this.methods[selector].apply(self, [parameters, context])
		}
		return super.respondTo(selector, parameters, context)
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
			this.variables['self'] = context
			return context
		}
		this.oracle.methods['newIsolatedContextBelow'] = (parameters, context) => {
			context = new MeatContext(new MeatOracle(), null, context, true)
			this.variables['self'] = context
			return context
		}
		this.oracle.methods['at:'] = (parameters, context) => {
			let name = parameters[0].string
			let c = this
			while (c && !c.variables[name]) {
				c = c.parent
			}
			if (c) {
				return c.variables[name]
			}
			let object = new MeatObject(new MeatOracle())
			this.variables[name] = object
			return object
		}
		this.oracle.methods['at:put:'] = (parameters, context) => {
			let name = parameters[0].string
			let object = parameters[1]
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
		if (selector == 'at:' && parameters[0].string == 'self') {
			return this.variables['self']
		}
		return super.respondTo(selector, parameters, context)
	}

}

class MeatBlock extends MeatObject {

	constructor(oracle, parameters, f) {
		super(oracle)
		this.parameters = parameters
		this.f = (parameters, context) => {
			this.parameters.forEach((parameter, i) => {
				context.respondTo('at:put:', [new MeatString(new MeatOracle(), parameter), parameters[i]], context)
			})
			return f.apply(this, [parameters, context])
		}
		this.oracle.methods['evaluateIn:'] = (parameters, context) => {
			context = context.respondTo('newContextBelow', [], context)
			return this.f.apply(this, [parameters, context])
		}
		this.oracle.methods['evaluate:'] = (parameters, context) => {
			context = context.respondTo('newIsolatedContextBelow', [], context)
			return this.f.apply(this, [parameters, context])
		}
		this.oracle.methods['evaluate'] = (parameters, context) => {
			context = context.respondTo('newIsolatedContextBelow', [], context)
			return this.f.apply(this, [parameters, context])
		}
	}

}

class MeatString extends MeatObject {

	constructor(oracle, string) {
		super(oracle)
		this.string = string
	}

}

class MeatComment extends MeatString {

}

class MeatNumber extends MeatObject {

	constructor(oracle, number) {
		super(oracle)
		this.number = number
		this.oracle.methods['+'] = (parameters, context) => {
			let summand = parameters[0].number
			return new MeatNumber(new MeatOracle(), this.number + summand)
		}
		this.oracle.methods['-'] = (parameters, context) => {
			let minuend = parameters[0].number
			return new MeatNumber(new MeatOracle(), this.number - minuend)
		}
		this.oracle.methods['<='] = (parameters, context) => {
			let comparand = parameters[0].number
			return new MeatBoolean(new MeatOracle(), this.number <= comparand)
		}
	}

}

class MeatBoolean extends MeatObject {

	constructor(oracle, boolean) {
		super(oracle)
		this.boolean = boolean
		this.oracle.methods['ifTrue:ifFalse:'] = (parameters, context) => {
			if (this.boolean) {
				return parameters[0].respondTo('evaluateIn:', [context], context)
			} else {
				return parameters[1].respondTo('evaluateIn:', [context], context)
			}
		}
	}

}

class MeatList extends MeatObject {

	constructor(oracle, items) {
		super(oracle)
		this.items = items
		this.oracle.methods['at:'] = (parameters, context) => {
			let index = parameters[0].number
			let object = this.items[index] || new MeatObject(new MeatOracle())
			this.items[index] = object
			return object
		}
		this.oracle.methods['at:put:'] = (parameters, context) => {
			let index = parameters[0].number
			this.items[index] = parameters[1]
			return this
		}
	}

}

module.exports = {
	MeatObject: MeatObject,
	MeatOracle: MeatOracle,
	MeatContext: MeatContext,
	MeatBlock: MeatBlock,
	MeatString: MeatString,
	MeatNumber: MeatNumber,
	MeatList: MeatList,
	MeatComment: MeatComment
}
