import parser from '@solidity-parser/parser';
import { TypeName } from '@solidity-parser/parser/dist/src/ast-types';

export class StateTypeParser {
  stateType: String;
  variableType: TypeName;

  constructor(stateType: String) {
    this.stateType = stateType;
    this.variableType = this.getVariableType();
  }

  testContract(stateType: String) {
    return `
              contract test {
                  ${stateType} a;
              }
            `;
  }

  getVariableType() {
    const contract = this.testContract(this.stateType);
    const ast = parser.parse(contract);
    let variableType: TypeName;
    parser.visit(ast, {
      VariableDeclaration: (node) => {
        variableType = node.typeName;
      },
    });
    return variableType;
  }
}
