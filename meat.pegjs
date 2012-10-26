/**
 * Grammar for meat.
 * 
 * @author Manuel Leuenberger
 */

start
	= statements

statements
	= ([\n\r]* statement:statement [\n\r]*
		{
			return statement;
		})*

statement
	= expression:expression message:message
		{
			return [expression, message];
		}
	/ comment

expression
	= literal
	/ "(" statement:statement ")"
		{
			return statement;
		}

literal
	= block
	/ string
	/ number
	/ list
	/ variable

block
	= "{" [\n\r] statements:([\t] statement:statement
		{
			return statement;
		})+ [\n\r] "}"
		{
			return statements;
		}

string
	= "'" string:[^']* "'"
		{
			return string.join("");
		}

number
	= integer:[0-9]+ fraction:("." fraction:[0-9]+
		{
			return "." + fraction.join("");
		})?
		{
			return integer.join("") + fraction;
		}

list
	= "[" expressions:(" " expression:expression
		{
			return expression;
		})* " ]"
		{
			return expressions;
		}

variable
	= variable:[a-zA-Z]+
		{
			return variable.join("");
		}

comment
	= "\"" comment:[^"]* "\""
		{
			return comment.join("");
		}

message
	= pairs:(" " selector:keyword " " argument:expression
		{
			return [selector, argument];
		})+
		{
			var selectors = [];
			var arguments = [];
			for(var i = 0; i < pairs.length; i++) {
				selectors.push(pairs[i][0]);
				arguments.push(pairs[i][1]);
			}
			return [selectors.join(""), arguments];
		}
	/ " " selector:binary " " argument:expression
		{
			return [selector, argument];
		}
	/ " " selector:unary
		{
			return selector;
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