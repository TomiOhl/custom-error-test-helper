const expect = require("chai").expect;
const { utils } = require("ethers");

async function expectRevertCustomError(contractInstance, contractCall, errorName, values) {
  try {
    await contractCall;
    expect.fail("Expected promise to throw but it didn't");
  } catch (revert) {
    if (errorName) {
      const errorAbi = contractInstance.abi.find((elem) => elem.type === "error" && elem.name === errorName);
      expect(errorAbi, `Expected custom error ${errorName}`).to.exist;

      const types = errorAbi.inputs.map((elem) => elem.type);

      const errorId = utils
        .solidityKeccak256(["string"], [`${errorName}(${types ? types.toString() : ""})`])
        .substring(0, 10);
      expect(JSON.stringify(revert), `Expected custom error ${errorName} (${errorId})`).to.include(errorId);

      if (values) {
        expect(values.length, "Expected the number of values to match the number of types").to.eq(types.length);
        const decodedValues = utils.defaultAbiCoder.decode(types, utils.hexDataSlice(revert.data.result, 4));
        decodedValues.forEach((elem, index) => expect(elem.toString()).to.eq(values[index].toString()));
      }
    }
  }
}

module.exports = {
  expectRevertCustomError,
};
