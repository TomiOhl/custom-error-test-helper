# Custom Error Test Helper

Library for testing Solidity custom errors with [Truffle](https://trufflesuite.com/truffle)/[Ganache](https://github.com/trufflesuite/ganache/releases).

## Installation

```bash
npm install --save-dev custom-error-test-helper
```

## Usage

Import `custom-error-test-helper` in your test files to access the assertion.

```js
const { expectRevertCustomError } = require("custom-error-test-helper");

const MyContract = artifacts.require("MyContract");

contract("MyContract", function (accounts) {
  beforeEach(async function () {
    this.contract = await MyContract.new();
  });

  it("reverts with an error with no parameters", async function () {
    // error SomeError0();
    await expectRevertCustomError(MyContract, this.contract.someFunction0(), "SomeError0");
  });

  it("reverts with an error with parameters", async function () {
    // error SomeError1(uint256 one, address vb);
    await expectRevertCustomError(MyContract, this.contract.someFunction1(), "SomeError1", [
      1,
      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    ]);
  });
});
```
