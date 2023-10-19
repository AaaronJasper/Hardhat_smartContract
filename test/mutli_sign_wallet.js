const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("mutli_sign_wallet", function () {
    let Wallet, wallet, owner
    const addresses = ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"];
    const number = 3;
    //測試前先部署 設定好參數
    beforeEach(async () => {
        Wallet = await ethers.getContractFactory('mutilSignWallet');
        wallet = await Wallet.deploy(addresses, number);
        owners = await ethers.getSigners();
    })
    //測試所有的錢包擁有者
    it("check owners", async function () {
        for (let i = 0; i < addresses.length; i++) {
            const address = await wallet.owners(i);
            expect(address).to.equal(addresses[i]);
        }
    });
    //測試查詢是否為錢包擁有者
    it("check isOwner", async function () {
        for (let i = 0; i < addresses.length; i++) {
            const address = await wallet.isOwner(addresses[i]);
            expect(address).to.equal(true);
        }
    });
});