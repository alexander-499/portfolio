type Evaluator = (x: number) => number;
type CompiledFunction = (x: number) => number | null;

type Token = {
  type: "number" | "identifier" | "operator" | "left" | "right" | "end";
  value: string;
};

const functions: Record<string, (value: number) => number> =
  Object.fromEntries(["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "abs", "exp", "log", "log10", "floor", "ceil", "round"].map(f => [f, Math[f]]));
const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 4 };

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;

  while (position < source.length) {
    const remaining = source.slice(position);
    const char = source[position]!;

    if (/\s/.test(char)) {
      position++;
      continue;
    }

    const number = remaining.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);

    if (number) {
      tokens.push({ type: "number", value: number[0] });
      position += number[0].length;
      continue;
    }

    const identifier = remaining.match(/^[a-zA-Z_][a-zA-Z_0-9]*/);

    if (identifier) {
      tokens.push({ type: "identifier", value: identifier[0] });
      position += identifier[0].length;
      continue;
    }

    if ("+-*/^%".includes(char)) tokens.push({ type: "operator", value: char });
    else if (char === "(") tokens.push({ type: "left", value: char });
    else if (char === ")") tokens.push({ type: "right", value: char });
    else throw new Error(`Unexpected character: ${char}`);

    position++;
  }

  tokens.push({ type: "end", value: "" });
  return tokens;
}

export function compileFunction(source: string): CompiledFunction {
  if (!source.trim()) throw new Error("Enter a function first.");
  if (source.length > 120) throw new Error("The expression is too long.");

  const tokens = tokenize(source);
  let position = 0;
  let nodeCount = 0;

  const peek = (): Token => tokens[position]!;

  function createNode(evaluate: Evaluator): Evaluator {
    if (++nodeCount > 100) throw new Error("The expression is too complex.");
    return evaluate;
  }

  function parsePrimary(): Evaluator {
    const token = tokens[position++]!;

    if (token.type === "number") {
      const value = Number(token.value);
      if (!Number.isFinite(value)) throw new Error("Only finite real numbers are supported.");
      return createNode(() => value);
    }

    if (token.type === "identifier") {
      if (token.value === "x") return createNode(x => x);
      if (token.value === "pi") return createNode(() => Math.PI);
      if (token.value === "e") return createNode(() => Math.E);

      if (Object.hasOwn(functions, token.value)) {
        if (peek().type !== "left") throw new Error(`${token.value} requires parentheses.`);
        position++;
        const argument = parseExpression();
        if (peek().type !== "right") throw new Error(`Expected ")" after ${token.value}.`);
        position++;
        return createNode(x => functions[token.value]!(argument(x)));
      }

      throw new Error(`Unknown symbol: ${token.value}`);
    }

    if (token.type === "left") {
      const evaluate = parseExpression();
      if (peek().type !== "right") throw new Error('Expected ")".');
      position++;
      return evaluate;
    }

    if (token.type === "operator" && (token.value === "+" || token.value === "-")) {
      const evaluate = parseExpression(3);
      return createNode(token.value === "-" ? x => -evaluate(x) : evaluate);
    }

    throw new Error(token.type === "end" ? "Unexpected end of expression." : `Unexpected token: ${token.value}`);
  }

  function parseExpression(minPrecedence = 0): Evaluator {
    let left = parsePrimary();

    while (true) {
      const token = peek();
      const implicit = token.type === "number" || token.type === "identifier" || token.type === "left";
      const operator = implicit ? "*" : token.type === "operator" ? token.value : null;
      const priority = operator === null ? undefined : precedence[operator];
      if (priority === undefined || priority < minPrecedence) break;
      if (!implicit) position++;

      const right = parseExpression(operator === "^" ? priority : priority + 1);
      const previous = left;

      switch (operator) {
        case "+": left = createNode(x => previous(x) + right(x)); break;
        case "-": left = createNode(x => previous(x) - right(x)); break;
        case "*": left = createNode(x => previous(x) * right(x)); break;
        case "/": left = createNode(x => previous(x) / right(x)); break;
        case "%": left = createNode(x => previous(x) % right(x)); break;
        case "^": left = createNode(x => previous(x) ** right(x)); break;
      }
    }

    return left;
  }

  const evaluate = parseExpression();

  if (peek().type !== "end") throw new Error(`Unexpected token: ${peek().value}`);

  return (x: number): number | null => {
    try {
      const result = evaluate(x);
      return Number.isFinite(result) ? result : null;
    } catch {
      return null;
    }
  };
}