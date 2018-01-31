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
			this.oracle = parameters.items[0]
			return this
		}
	}

	respondTo(selector, parameters, context) {
		return this.oracle.respondTo(selector, parameters, context)
	}

}

class MeatOracle extends MeatObject {

	constructor() {
		super({})
		this.methods = {}
		MeatObject.apply(this, [this])
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

	constructor(oracle, self) {
		super(oracle)
		this.variables = {}
		this.variables['context'] = this
		this.variables['self'] = self
		this.oracle.methods['newOracle'] = (parameters, context) => {
			return new MeatOracle()
		}
		this.oracle.methods['newContextWith:with:'] = (parameters, context) => {
			return new MeatContext(parameters.items[0], parameters.items[1])
		}
		this.oracle.methods['newObjectWith:'] = (parameters, context) => {
			return new MeatObject(parameters.items[0])
		}
		this.oracle.methods['at:'] = (parameters, context) => {
			let name = parameters.items[0].string
			let object = this.variables[name] || new MeatObject(new MeatOracle())
			this.variables[name] = object
			return object
		}
		this.oracle.methods['at:put:'] = (parameters, context) => {
			let name = parameters.items[0].string
			let object = parameters.items[1]
			this.variables[name] = object
			return object
		}
	}

}

class MeatBlock extends MeatObject {

	constructor(oracle, f) {
		super(oracle)
		this.f = f
		this.oracle.methods['evaluateWith:with:'] = (parameters, context) => {
			return this.f.apply(this, [parameters.items[0], parameters.items[1]])
		}
	}

}

class MeatString extends MeatObject {

	constructor(oracle, string) {
		super(oracle)
		this.string = string
	}

}

class MeatNumber extends MeatObject {

	constructor(oracle, number) {
		super(oracle)
		this.number = number
		this.oracle.methods['+'] = (parameters, context) => {
			let summand = parameters.items[0].number
			return new MeatNumber(new MeatOracle(), this.number + summand)
		}
	}

}

class MeatList extends MeatObject {

	constructor(oracle, items) {
		super(oracle)
		this.items = items
		this.oracle.methods['at:'] = (parameters, context) => {
			let index = parameters.items[0].number
			let object = this.items[index] || new MeatObject(new MeatOracle())
			this.items[index] = object
			return object
		}
		this.oracle.methods['at:put:'] = (parameters, context) => {
			let index = parameters.items[0].number
			this.items[index] = parameters.items[1]
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
	MeatList: MeatList
}
