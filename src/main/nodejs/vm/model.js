class MeatObject {

	oracle() {
		if (!this._oracle) {
			this._oracle = this.newOracle()
		}
		return this._oracle
	}

	newOracle() {
		return new MeatObjectOracle(this)
	}

	respondTo(selector, parameters, context) {
		console.debug('>', 'MeatObject', this.constructor.name, this.toString(), selector, parameters.toString())
		try {
			let result = this.oracle().respondTo('evaluateWith:in:', new MeatList([new MeatList([new MeatString(selector), parameters]), context]), context)
			console.debug('<', 'MeatObject', this.constructor.name, this.toString(), selector, parameters.toString(), result.toString())
			return result
		} catch (exception) {
			console.debug('!', 'MeatObject', this.constructor.name, this.toString(), selector, parameters.toString())
			throw exception
		}
	}

	toString() {
		return '@Object'
	}

}

class MeatBlock extends MeatObject {

	constructor(parameters, f) {
		super()
		this.parameters = parameters
		this.f = (parameters, context) => {
			this.parameters.forEach((parameter, i) => {
				let value = parameters.respondTo('at:', new MeatList([
					new MeatNumber(i + 1)
				]), context)
				context.respondTo('at:put:', new MeatList([
					new MeatString(parameter),
					value
				]), context)
			})
			return f.apply(this, [parameters, context])
		}
		this.methods = {
			'evaluateWith:in:': (parameters, context) => {
				context = parameters.items[1]
				parameters = parameters.items[0]
				return this.f.apply(this, [parameters, context])
			},
			'oracle': (parameters, context) => {
				return this
			},
			'oracle:': (parameters, context) => {
				this._oracle = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context)
				return this.self
			}
		}
	}

	respondTo(selector, parameters, context) {
		if (this._oracle) {
			return super.respondTo(selector, parameters, context)
		}
		console.debug('>', 'MeatBlock', this.constructor.name, this.toString(), selector, parameters.toString())
		try {
			let result = this.methods[selector].apply(this, [parameters, context])
			console.debug('<', 'MeatBlock', this.constructor.name, this.toString(), selector, parameters.toString(), result.toString())
			return result
		} catch (exception) {
			console.debug('!', 'MeatBlock', this.constructor.name, this.toString(), selector, parameters.toString(), Object.keys(this.methods), this)
			throw exception
		}
	}

	toString() {
		return '@Block'
	}

}

class MeatContext extends MeatObject {

	constructor(parent, isolated) {
		super()
		this.parent = parent
		this.isolated = isolated
		this.variables = {}
		this.variables['context'] = this
	}

	newOracle() {
		return new MeatContextOracle(this)
	}

	toString() {
		return `@Context(${this.isolated}, [${Object.keys(this.variables).map((key) => {
			if (this.variables[key] == this) {
				return `${key}=self`
			}
			return `${key}=${this.variables[key].toString()}`
		}).join(', ')}], ${this.parent && this.parent.toString()})`
	}

}

class MeatVariable extends MeatObject {

	constructor(object) {
		super()
		this.object = object
	}

	respondTo(selector, parameters, context) {
		if (selector == 'oracle' || selector == 'oracle:' || selector == 'object' || selector == 'object:') {
			return super.respondTo(selector, parameters, context)
		}
		// TODO get object from self
		console.debug('>', 'MeatVariable', this.constructor.name, this.toString(), selector, parameters.toString())
		try {
			let result = this.object.respondTo(selector, parameters, context)
			console.debug('<', 'MeatVariable', this.constructor.name, this.toString(), selector, parameters.toString(), result.toString())
			return result
		} catch (exception) {
			console.debug('!', 'MeatVariable', this.constructor.name, this.toString(), selector, parameters.toString())
			throw exception
		}
	}

	newOracle() {
		return new MeatVariableOracle(this)
	}

	toString() {
		return `$${this.object.toString()}`
	}

}

class MeatString extends MeatObject {

	constructor(string) {
		super()
		this.string = string
	}

	toString() {
		return `'${this.string}'`
	}

}

class MeatComment extends MeatString {

}

class MeatNumber extends MeatObject {

	constructor(number) {
		super()
		this.number = number
	}

	newOracle() {
		return new MeatNumberOracle(this)
	}

	toString() {
		return this.number.toString()
	}

}

class MeatBoolean extends MeatObject {

	constructor(boolean) {
		super()
		this.boolean = boolean
	}

	newOracle() {
		return new MeatBooleanOracle(this)
	}

	toString() {
		return this.boolean.toString()
	}

}

class MeatList extends MeatObject {

	constructor(items) {
		super()
		this.items = items
	}

	newOracle() {
		return new MeatListOracle(this)
	}

	toString() {
		return `[${this.items.toString()}]`
	}

}

class MeatObjectOracle extends MeatBlock {

	constructor(self) {
		super([], (parameters, context) => {
			// TODO send at: instead?
			let selector = parameters.items[0]
			parameters = parameters.items[1]
			if (this.methods.hasOwnProperty(selector.string)) {
				return this.methods[selector.string].apply(this, [parameters, context])
			}
			throw new Error(`${selector.toString()}, ${Object.keys(this.methods)}, ${parameters.toString()}`)
		})
		this.self = self
	}

	toString() {
		return '@ObjectOracle'
	}

}

class MeatContextOracle extends MeatObjectOracle {

	constructor(self) {
		super(self)
		Object.assign(this.methods, {
			'newContextBelow': (parameters, context) => {
				return new MeatContext(context, false)
			},
			'newIsolatedContextBelow': (parameters, context) => {
				return new MeatContext(context, true)
			},
			'at:': (parameters, context) => {
				let name = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context).string
				let c = this.self
				// TODO send at: to parent instead of while
				while (c && !c.variables[name]) {
					c = c.parent
				}
				if (c) {
					return c.variables[name]
				}
				let object = new MeatVariable(new MeatObject())
				this.self.variables[name] = object
				return object
			},
			'at:put:': (parameters, context) => {
				let name = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context).string
				let object = parameters.respondTo('at:', new MeatList([
					new MeatNumber(2)
				]), context)
				if (!(object instanceof MeatVariable)) {
					object = new MeatVariable(object)
				}
				if (!this.isolated) {
					let c = this.self
					// TODO send at: to parent instead of while
					while (c && !c.variables[name] && !c.isolated) {
						c = c.parent
					}
					if (c) {
						c.variables[name] = object
						return object
					}
				}
				this.self.variables[name] = object
				return object
			}
		})
	}

	toString() {
		return '@ContextOracle'
	}

}

class MeatVariableOracle extends MeatObjectOracle {

	constructor(self) {
		super(self)
		Object.assign(this.methods, {
			'object': (parameters, context) => {
				return this.self.object
			},
			'object:': (parameters, context) => {
				this.self.object = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context)
				return this.self
			}
		})
	}

	toString() {
		return '@VariableOracle'
	}

}

class MeatNumberOracle extends MeatObjectOracle {

	constructor(self) {
		super(self)
		Object.assign(this.methods, {
			'+': (parameters, context) => {
				let summand = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context).number
				return new MeatNumber(this.self.number + summand)
			},
			'-': (parameters, context) => {
				let minuend = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context).number
				return new MeatNumber(this.self.number - minuend)
			},
			'<=': (parameters, context) => {
				let comparand = parameters.respondTo('at:', new MeatList([
					new MeatNumber(1)
				]), context).number
				return new MeatBoolean(this.self.number <= comparand)
			}
		})
	}

	toString() {
		return '@NumberOracle'
	}

}

class MeatBooleanOracle extends MeatObjectOracle {

	constructor(self) {
		super(self)
		Object.assign(this.methods, {
			'ifTrue:ifFalse:': (parameters, context) => {
				if (this.self.boolean) {
					return parameters.respondTo('at:', new MeatList([
						new MeatNumber(1)
					]), context).respondTo('evaluateWith:in:', new MeatList([
						new MeatList([]),
						context
					]), context)
				} else {
					return parameters.respondTo('at:', new MeatList([
						new MeatNumber(2)
					]), context).respondTo('evaluateWith:in:', new MeatList([
						new MeatList([]),
						context
					]), context)
				}
			}
		})
	}

	toString() {
		return '@BooleanOracle'
	}

}

class MeatListOracle extends MeatObjectOracle {

	constructor(self) {
		super(self)
		Object.assign(this.methods, {
			'at:': (parameters, context) => {
				let index = parameters.items[0].number - 1
				let object = this.self.items[index] || new MeatObject()
				this.self.items[index] = object
				return object
			},
			'at:put:': (parameters, context) => {
				let index = parameters.items[0].number - 1
				this.self.items[index] = parameters.items[1]
				return this.self
			}
		})
	}

	toString() {
		return '@ListOracle'
	}

}

module.exports = {
	MeatObject: MeatObject,
	MeatVariable: MeatVariable,
	MeatContext: MeatContext,
	MeatBlock: MeatBlock,
	MeatString: MeatString,
	MeatNumber: MeatNumber,
	MeatBoolean: MeatBoolean,
	MeatList: MeatList,
	MeatComment: MeatComment
}
