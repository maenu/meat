/**
 * Grammar for meat.
 * 
 * @author Manuel Leuenberger
 */

{
	var expectedIndent = 0;
}

statements
	= statements:
		(
			indent:'\t'* statement:statement '\n'
				{
					if (indent.length != expectedIndent) {
						throw new Error('bad indent');
					}
					return statement;
				}
		)+
		{
			return new meat.ast.node.Statements(statements);
		}

indent
	= {
		expectedIndent = expectedIndent + 1;
	}

dedent
	= {
		expectedIndent = expectedIndent - 1;
	}

statement
	= comment
	/ messageSend

comment
	= '"\n' indent commentLines:commentLine+ dedent indent:'\t'* '"'
		{
			if (indent.length != expectedIndent) {
				throw new Error('bad indent');
			}
			return new meat.ast.node.Comment(commentLines);
		}

commentLine
	= indent:'\t'* characters:[^"\n]* '\n'
		{
			if (indent.length != expectedIndent) {
				throw new Error('bad indent');
			}
			return characters.join('');
		}

messageSend
	= receiver:expression message:message
		{
			return new meat.ast.node.MessageSend(receiver, message);
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
			return new meat.ast.node.KeywordMessage(selector.join(''), parameters);
		}
	/ ' ' selector:binary ' ' parameter:expression
		{
			return new meat.ast.node.BinaryMessage(selector, parameter);
		}
	/ ' ' selector:unary
		{
			return new meat.ast.node.UnaryMessage(selector);
		}

unary
	= selector:[a-zA-Z]+
		{
			return selector.join('');
		}

binary
	= selector:[+\-*/=<>:\.]+
		{
	        return selector.join('');
		}

keyword
	= selector:[a-zA-Z]+ ':'
		{
			return selector.join('') + ':';
		}

literal
	= variable
	/ block
	/ character
	/ string
	/ number
	/ list

variable
	= name:[a-zA-Z]+
		{
			return new meat.ast.node.Variable(name.join(''));
		}

block
	= '{\n' indent statements:statements dedent indent:'\t'* '}'
		{
			if (indent.length != expectedIndent) {
				throw new Error('bad indent');
			}
			return new meat.ast.node.Block(statements);
		}

character
	= '$' character:.
		{
			return new meat.ast.node.Character(character);
		}

string
	= '\'' string:[^']* '\''
		{
			return new meat.ast.node.String(string.join(''));
		}

number
	= '0'
		{
			return new meat.ast.node.Number(0);
		}
	/ digits:[1-9][0-9]*
		{
			return new meat.ast.node.Number(parseInt(digits.join('')));
		}

list
	= '[]'
		{
			return new meat.ast.node.List([]);
		}
	/ '[' items:
		(
			firstItem:expression nextItems:
				(
					' ' nextItem:expression
						{
							return nextExpression;
						}
				)*
				{
					var items = [firstItem];
					for (var i = 0; i < nextItems.length; i = i + 1) {
						items.push(nextItems[i]);
					}
					return items;
				}
		)
		']'
		{
			return new meat.ast.node.List(items);
		}
