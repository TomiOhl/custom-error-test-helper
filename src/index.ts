import { expect } from "chai";
import { utils } from "ethers";

/**
 * Tests a contract call if it reverts with a specific custom error.
 * @param contractInstance The contract artifact compiled with Truffle.
 * @param contractCall The method call with arguments.
 * @param errorName The name of the custom error.
 * @param values The expected arguments of the custom error.
 */
export async function expectRevertCustomError(
  contractInstance: any,
  contractCall: Promise<any>,
  errorName: string,
  values?: any[]
) {
  try {
    await contractCall;
    expect.fail("Expected promise to throw but it didn't");
  } catch (revert: any) {
    const errorAbi = contractInstance.abi.find((elem: any) => elem.type === "error" && elem.name === errorName);
    expect(errorAbi, `Expected custom error ${errorName}`).to.exist;

    const types: string[] = errorAbi.inputs.map((elem: any) => elem.type);

    const errorId = utils
      .solidityKeccak256(["string"], [`${errorName}(${types ? types.toString() : ""})`])
      .substring(0, 10);
    expect(JSON.stringify(revert), `Expected custom error ${errorName} (${errorId})`).to.include(errorId);

    if (values) {
      expect(values.length, "Expected the number of values to match the number of types").to.eq(types.length);
      const revertData = typeof revert.data === "string" ? revert.data : revert.data.result;
      const decodedValues = utils.defaultAbiCoder.decode(types, utils.hexDataSlice(revertData, 4));
      decodedValues.forEach((elem, index) => expect(elem.toString()).to.eq(values[index].toString()));
    }
  }
}
