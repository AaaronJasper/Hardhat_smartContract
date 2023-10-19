const hre = require("hardhat");

async function main() {
	//取得合約
  const TestContract = await hre.ethers.getContractFactory("Add");
	//部署合約(可傳入建構子所需參數)
  const test = await TestContract.deploy();
	//執行函式
  console.log(await test.add(1,2))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});