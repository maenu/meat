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
			return new maenulabs.meat.ast.StatementsNode(statements);
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
			return new maenulabs.meat.ast.CommentNode(commentLines);
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
			return new maenulabs.meat.ast.MessageSendNode(expression, message);
		}

expression
	= literal
	/ comment
	/ '(' messageSend:messageSend ')'
		{
			return messageSend;
		}

literal
	= variable
	/ object
	/ block
	/ character
	/ string
	/ number
	/ list

variable
	= identifier:[a-zA-Z]+
		{
			return new maenulabs.meat.ast.VariableNode(identifier.join(''));
		}

object
	= '.'
		{
			return new maenulabs.meat.ast.ObjectNode();
		}

block
	= '{\n' indent statements:statements dedent indent:'\t'* '}'
		{
			if (indent.length != expectedIndent) {
				throw new Error('bad indent');
			}
			return new maenulabs.meat.ast.BlockNode(statements);
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
			return new maenulabs.meat.ast.CharacterNode(character);
		}

string
	= '\'' string:[^']* '\''
		{
			return new maenulabs.meat.ast.StringNode(string.join(''));
		}

number
	= signum:'-'? integer:[0-9]+ fraction:('.' fraction:[0-9]+
		{
			return '.' + fraction.join('');
		})?
		{
			if (signum != '-') {
				signum = '+';
			}
			return new maenulabs.meat.ast.NumberNode(parseFloat(signum + integer.join('') + fraction));
		}

list
	= '[]'
		{
			return new maenulabs.meat.ast.ListNode([]);
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
			return new maenulabs.meat.ast.ListNode(expressions);
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
			return new maenulabs.meat.ast.KeywordMessageNode(selector.join(''), arguments);
		}
	/ ' ' selector:binary ' ' argument:expression
		{
			return new maenulabs.meat.ast.BinaryMessageNode(selector, argument);
		}
	/ ' ' selector:unary
		{
			return new maenulabs.meat.ast.UnaryMessageNode(selector);
		}

unary
	= selector:[a-zA-Z]+
		{
			return selector.join('');
		}

binary
	= selector:[+\-*/=<>:]+
		{
	        return selector.join('');
		}

keyword
	= selector:[a-zA-Z]+ ':'
		{
			return selector.join('') + ':';
		}