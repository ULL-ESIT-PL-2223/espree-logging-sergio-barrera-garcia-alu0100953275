import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8', (err) => {
    if (err) {
      console.log(err);
    }
  });
  const afterAdd = addLogging(input);

  fs.writeFile(outputFile, afterAdd, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
    }
  });
}

export function addLogging(code) {
  const ast = espree.parse(code, {ecmaVersion:12, loc:true});
  estraverse.traverse(ast, {
      enter: function(node, parent) {
          if (node.type === 'FunctionDeclaration' ||
              node.type === 'FunctionExpression' || 
              node.type === 'ArrowFunctionExpression') {
              addBeforeCode(node);
          }
      }
  });

  return escodegen.generate(ast);
}

function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
  let arrayNames = []
  for (let iterator in node.params) {
    arrayNames.push('${ ' + (node.params[iterator].name) + " }")
  }
  var beforeCode = "console.log(`Entering " + name + "(" + arrayNames.toString() +  ") at line " + node.loc.start.line + "`);";
  var beforeNodes = espree.parse(beforeCode, {ecmaVersion:12}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
