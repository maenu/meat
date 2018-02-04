# meat

This is the meat language.
Meat is object-oriented.
Everything in meat is an object.
Every meat object has an *oracle*, which is receives all messages sent to the owning object.
A meat program must not include the identifier *vegetable*, or it will not parse.
There is exactly one way to format a meat program; whitespace is syntax, so are parenthesis.
Meat allows object-level meta-programming.

## FAQ

### Why?

I wanted an object-oriented language that does not impose a heavy paradigm like classes or prototypes.
I wanted a language that is minimal, but allows me instrument its own execution:
You can change the lookup of variables and intercept messages.
Its syntax and the messaging concept is heavily inspired by Smalltalk.

### How does is look?

Computing the 20th fibonacci number looks like this:

```
"
	This is a fibonacci program.
"
f := [ i
	(i <= 1) ifTrue: [
		1
	] ifFalse: [
		(f evaluate: (i - 2)) + (f evaluate: (i - 1))
	]
]
f evaluate: 20
```

### Is it turing-complete?
Probably not. Yet.

### Where does it run?
It transpiles to node.

### Is it fast?
Hell no, it's about 5500x slower than pure node computing the 20th fibonacci number recursively.
