/**
 * JavaScript virtual machine model for meat.
 *
 * @author Manuel Leuenberger
 */

class MeatObject {

	constructor() {
		this.oracle = new MeatOracle()
		this.oracle.methods['oracle'] = function (selector, parameters, context) {
			return this.oracle
		}
		this.oracle.methods['oracle:'] = function (selector, parameters, context) {
			this.oracle = parameters[0]
			return this
		}
	}

	respondTo(selector, parameters, context) {
		context = context.respondTo('newContextBelow:receivedBy:', [context, this], context)
		return this.oracle.respondTo(selector, parameters, context, this)
	}

}

class MeatOracle {

	constructor() {
		this.methods = {}
	}

	respondTo(selector, parameters, context, receiver) {
		return this.methods[selector].apply(receiver, [selector, parameters, context])
	}

}

class MeatVariableOracle extends MeatOracle {

	respondTo(selector, parameters, context, receiver) {
		if (this.methods[selector] !== undefined) {
			return this.base('respondTo')(selector, parameters, context, receiver)
		}
		let variable = context.respondTo('at:', ['this'], context)
		let object = variable.respondTo('object', [], context)
		return object.respondTo(selector, parameters, context)
	}

}

class MeatVariable extends MeatObject {

	constructor() {
		super()
		this.object = new MeatObject()
		this.oracle = new MeatVariableOracle(this.oracle.methods)
		this.oracle.methods['object'] = function (selector, parameters, context) {
			return this.object
		}
		this.oracle.methods['object:'] = function (selector, parameters, context) {
			let object = parameters[0]
			this.object = object
			return this
		}
	}

}

class MeatContext extends MeatObject {

	constructor(parent, receiver) {
		super()
		this.parent = parent
		this.receiver = receiver
		this.variables = {}
		this.variables['context'] = this
		this.variables['this'] = this.receiver
		// bind to this since we bypass recursion
		this.oracle.methods['newContextBelow:receivedBy:'] = (function (selector, parameters, context) {
			return new MeatContext(parameters[0], parameters[1])
		}).bind(this)
		this.oracle.methods['newVariable'] = (function (selector, parameters, context) {
			return new MeatVariable()
		}).bind(this)
		this.oracle.methods['at:'] = (function (selector, parameters, context) {
			let name = parameters[0]
			let variable = (this.variables[name] !== undefined)
				? this.variables[name]
				: context.respondTo('newVariable', [], context)
			this.variables[name] = variable
			return this.variables[name]
		}).bind(this)
		this.oracle.methods['at:put:'] = (function (selector, parameters, context) {
			let name = parameters[0]
			let object = parameters[1]
			let variable = (this.variables[name] !== undefined)
				? this.variables[name]
				: context.respondTo('newVariable', [], context)
			this.variables[name] = variable
			variable.respondTo('object:', [object], context)
			return this
		}).bind(this)
	}

	respondTo(selector, parameters, context) {
		// bypass recursion
		return this.oracle.respondTo(selector, parameters, context, this.receiver)
	}

}

class MeatBlock extends MeatObject {

	constructor(f) {
		super()
		this.f = f
		this.oracle.methods['runIn:'] = function (selector, parameters, context) {
			return this.f.apply(this, [selector, parameters, context])
		}
	}

}

class MeatString extends MeatObject {

	constructor(string) {
		super()
		this.string = string
	}

}

class MeatNumber extends MeatObject {

	constructor(number) {
		super()
		this.number = number
		this.oracle.methods['+'] = function (selector, parameters, context) {
			let summand = parameters[0]
			return new MeatNumber(this.number + summand.number)
		}
	}

}

module.exports = {
	MeatObject: MeatObject,
	MeatOracle: MeatOracle,
	MeatVariableOracle: MeatVariableOracle,
	MeatVariable: MeatVariable,
	MeatContext: MeatContext,
	MeatBlock: MeatBlock,
	MeatString: MeatString,
	MeatNumber: MeatNumber
}
