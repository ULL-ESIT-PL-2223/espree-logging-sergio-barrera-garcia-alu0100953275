import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

/**
 * @description Transpiles the code in inputFile and writes the result in outputFile
 * @param {string} inputFile - The file with the original code
 * @param {string} outputFile - The file in which to write the output
 * @returns {Promise<void>} A promise that resolves when the file is written
 * @example
 * transpile('test1.js', 'logged1.js')
*/
export async function transpile(inputFile, outputFile = "salida.js") {
  let input = await fs.readFile(inputFile, 'utf-8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File read successfully\n");
    }
  });
  const afterAdd = addLogging(input);

  await fs.writeFile(outputFile, afterAdd, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`File written successfully in ${outputFile} \n`);
    }
  });
}

/**
 * @description Adds logging to the code
 * @param {string} code - The code to add logging to
 * @returns {string} The code with logging added
 * @example
 * addLogging('function f(x) { return x + 1; }')
 *  returns 'function f(x) { console.log(`Entering f(${x}) at line 1`); return x + 1; }'
*/
export function addLogging(code) {
  const ast = espree.parse(code, {ecmaVersion:6, loc:true});
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

/**
 * @description Adds logging to the code
 * @param {string} node - The node to add logging to
 * @example
 * addBeforeCode('function f(x) { return x + 1; }')
 * returns 'function f(x) { console.log(`Entering f(${x}) at line 1`); return x + 1; }'
*/
function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
  let arrayNames = []
  for (let iterator in node.params) {
    arrayNames.push('${ ' + (node.params[iterator].name) + " }")
  }
  var beforeCode = "console.log(`Entering " + name + "(" + arrayNames.toString() +  ") at line " + node.loc.start.line + "`);";
  var beforeNodes = espree.parse(beforeCode, {ecmaVersion:6}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
