/**
 * Grammar for meat.
 * 
 * @author Manuel Leuenberger
 */

{
	var expectedIndent = 0;
}

statements
	= statements:(indent:'\t'* statement:statement '\n'
		{
			if (indent.length != expectedIndent) {
				throw new Error('bad indent');
			}
			return statement;
		})+
		{
			return new meat.ast.StatementsNode(statements);
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
			return new meat.ast.CommentNode(commentLines);
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
	= expression:expression message:message
		{
			return new meat.ast.MessageSendNode(expression, message);
		}

expression
	= literal
	/ '(' messageSend:messageSend ')'
		{
			return messageSend;
		}

literal
	= variable
	/ block
	/ character
	/ string
	/ number
	/ list

variable
	= identifier:[a-zA-Z]+
		{
			return new meat.ast.VariableNode(identifier.join(''));
		}

block
	= '{\n' indent statements:statements dedent indent:'\t'* '}'
		{
			if (indent.length != expectedIndent) {
				throw new Error('bad indent');
			}
			return new meat.ast.BlockNode(statements);
		}

indent
	= {
		expectedIndent = expectedIndent + 1;
	}

dedent
	= {
		expectedIndent = expectedIndent - 1;
	}

character
	= '$' character:.
		{
			return new meat.ast.CharacterNode(character);
		}

string
	= '\'' string:[^']* '\''
		{
			return new meat.ast.StringNode(string.join(''));
		}

number
	= digits:[0-9]+
		{
			return new meat.ast.NumberNode(parseInt(digits.join('')));
		}

list
	= '[]'
		{
			return new meat.ast.ListNode([]);
		}
	/ '[' expressions:(firstExpression:expression nextExpressions:(' ' nextExpression:expression
		{
			return nextExpression;
		})*
		{
			var expressions = [firstExpression];
			for (var i = 0; i < nextExpressions.length; i++) {
				expressions.push(nextExpressions[i]);
			}
			return expressions;
		}) ']'
		{
			return new meat.ast.ListNode(expressions);
		}

message
	= pairs:(' ' selector:keyword ' ' argument:expression
		{
			return [selector, argument];
		})+
		{
			var selector = [];
			var arguments = [];
			for (var i = 0; i < pairs.length; i++) {
				selector.push(pairs[i][0]);
				arguments.push(pairs[i][1]);
			}
			return new meat.ast.KeywordMessageNode(selector.join(''), arguments);
		}
	/ ' ' selector:binary ' ' argument:expression
		{
			return new meat.ast.BinaryMessageNode(selector, argument);
		}
	/ ' ' selector:unary
		{
			return new meat.ast.UnaryMessageNode(selector);
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