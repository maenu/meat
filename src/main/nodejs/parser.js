const fs = require('fs')
const peg = require('pegjs')

class Parser {

	constructor(options) {
		this.parser = peg.generate(fs.readFileSync('./src/main/pegjs/grammar.pegjs').toString(), options)
	}

	parse(source, options) {
		return this.parser.parse(source, options)
	}

}

module.exports = {
	Parser: Parser
}
