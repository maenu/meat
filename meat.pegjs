/**
 * Grammar for meat.
 * 
 * @author Manuel Leuenberger
 */

start
	= statements

statements
	= statements:([\r\n]* statement:statement [\r\n]*
		{
			return statement;
		})*
		{
			return new maenulabs.meat.ast.StatementsNode(statements);
		}

statement
	= messageSend
	/ comment

messageSend
	= expression:expression message:message
		{
			return new maenulabs.meat.ast.MessageSendNode(expression, message);
		}

expression
	= literal
	/ "(" statement:statement ")"
		{
			return statement;
		}

literal
	= block
	/ character
	/ string
	/ number
	/ list
	/ variable

block
	= "{" [\r\n] statements:([\t] statement:statement
		{
			return statement;
		})+ [\r\n] "}"
		{
			return new maenulabs.meat.ast.BlockNode(statements);
		}

character
	= "$" character:.
		{
			return new maenulabs.meat.ast.CharacterNode(character);
		}

string
	= "'" string:[^']* "'"
		{
			return new maenulabs.meat.ast.StringNode(string.join(""));
		}

number
	= integer:[0-9]+ fraction:("." fraction:[0-9]+
		{
			return "." + fraction.join("");
		})?
		{
			return new maenulabs.meat.ast.NumberNode(parseFloat(integer.join("") + fraction));
		}

list
	= "[" expressions:(" " expression:expression
		{
			return expression;
		})* " ]"
		{
			return new maenulabs.meat.ast.ListNode(expressions);
		}

variable
	= variable:[a-zA-Z]+
		{
			return new maenulabs.meat.ast.VariableNode(variable.join(""));
		}

comment
	= "\"" comment:[^"]* "\""
		{
			return new maenulabs.meat.ast.CommentNode(comment.join(""));
		}

message
	= pairs:(" " selector:keyword " " expression:expression
		{
			return [selector, expression];
		})+
		{
			var selectors = [];
			var expressions = [];
			for(var i = 0; i < pairs.length; i++) {
				selectors.push(pairs[i][0]);
				expressions.push(pairs[i][1]);
			}
			return new maenulabs.meat.ast.KeywordMessageNode(selectors.join(""), expressions);
		}
	/ " " selector:binary " " expression:expression
		{
			return new maenulabs.meat.ast.BinaryMessageNode(selector, expression);
		}
	/ " " selector:unary
		{
			return new maenulabs.meat.ast.UnaryMessageNode(selector);
		}

unary
	= selector:[a-zA-Z]+
		{
			return selector.join("");
		}

binary
	= selector:[+\-*/=<>:]+
		{
	        return selector.join("");
		}

keyword
	= selector:[a-zA-Z]+ ":"
		{
			return selector.join("") + ":";
		}