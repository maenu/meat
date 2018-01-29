/**
 * Grammar for meat.
 * 
 * @author Manuel Leuenberger
 */

{
    var node = require('../../../../src/main/nodejs/ast/node');
	var expectedIndentation = 0;
	var checkIndentation = function (actualIndentation) {
		if (actualIndentation != expectedIndentation) {
			throw new Error('bad indent');
		}
	};
}

goal
    = statements

indent
	= ''
        {
            expectedIndentation = expectedIndentation + 1;
        }

dedent
	= ''
        {
            expectedIndentation = expectedIndentation - 1;
        }

statements
	= statements:
		(
			actualIndentations:'\t'* statement:statement '\n'
				{
					checkIndentation(actualIndentations.length);
					return statement;
				}
		)+
		{
			return new node.Statements(statements);
		}

statement
	= comment
	/ messageSend

comment
	= '"\n' indent commentLines:commentLine+ dedent actualIndentations:'\t'* '"'
		{
			checkIndentation(actualIndentations.length);
			return new node.Comment(commentLines);
		}

commentLine
	= actualIndentations:'\t'* characters:[^"\n]* '\n'
		{
			checkIndentation(actualIndentations.length);
			return characters.join('');
		}

messageSend
	= receiver:expression message:message
		{
			return new node.MessageSend(receiver, message);
		}

expression
	= literal
	/ '(' messageSend ')'

message
	= pairs:
		(
			' ' selector:keyword ' ' parameter:expression
				{
					return [selector, parameter];
				}
		)+
		{
			var selector = [];
			var parameters = [];
			for (var i = 0; i < pairs.length; i = i + 1) {
				selector.push(pairs[i][0]);
				parameters.push(pairs[i][1]);
			}
			return new node.KeywordMessage(selector.join(''), parameters);
		}
	/ ' ' selector:binary ' ' parameter:expression
		{
			return new node.BinaryMessage(selector, parameter);
		}
	/ ' ' selector:unary
		{
			return new node.UnaryMessage(selector);
		}

unary
	= selector:identifier
		{
			return selector;
		}

binary
	= selector:[+\-*/=<>:\.]+
		{
	        return selector.join('');
		}

keyword
	= selector:identifier ':'
		{
			return selector + ':';
		}

literal
	= variable
	/ block
	/ string
	/ number

variable
	= identifier:identifier
		{
			return new node.Variable(identifier);
		}

block
	= '{' statements:('\n' indent statements:statements dedent actualIndentations:'\t'*
        {
            checkIndentation(actualIndentations.length);
            return statements;
        })? '}'
		{
		    if (statements) {
			    return new node.Block(statements);
		    }
		    return new node.Block(new node.Statements([]));
		}

string
	= '\'' string:[^']* '\''
		{
			return new node.String(string.join(''));
		}

number
    = ('0' / ([1-9] [0-9]*)) ('.' [0-9]+)?
		{
			return new node.Number(parseFloat(text()));
		}

identifier
	= !'vegetable' identifier:([a-zA-Z]+([0-9]/[a-zA-Z])*)
		{
			return identifier[0].join('') + identifier[1].join('');
		}
