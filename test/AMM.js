const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Uniswap V2", function () {
    let token0, Token1, owner, LPtokenAddress, LPtokenInstance
    const token_amount = 1000000;
    const token0_amount = 90000;
    const token1_amount = 40000;
    //測試前先部署 設定好參數
    beforeEach(async () => {
        //部署合約
        Dex = await ethers.getContractFactory('AMM');
        dex = await Dex.deploy();
        //為隨機取得使用者 需用owner.address
        [owner, addr1] = await ethers.getSigners();
        Token0 = await ethers.getContractFactory('LPtoken');
        token0 = await Token0.deploy();
        Token1 = await ethers.getContractFactory('LPtoken');
        token1 = await Token1.deploy();
        //鑄造及授權
        await token0.mint(owner.address, token_amount);
        await token1.mint(owner.address, token_amount);
        await token0.approve(dex, token_amount);
        await token1.approve(dex, token_amount);
        //添加流動性
        await dex.addLiquidity(token0, token1, token0_amount, token1_amount);
        //取得LPtoken地址
        LPtokenAddress = await dex.checkLPtokenAddress(token0, token1)
        //LPtoken實例合約
        LPtokenInstance = await ethers.getContractAt('LPtoken', LPtokenAddress);
    })
    //確認合約擁有者
    it("check owner", async function (){
        // 使用 await 等待 owner 函數的返回值
        const contractOwner = await dex.owner();
        // 檢查 contractOwner 是否等於 owner 的地址
        expect(contractOwner).to.equal(owner.address);
    });
    //添加流動性
    it("add liquidity", async function (){;
        //取得添加流動性池子量
        const actualValue0 = await dex.reserve(LPtokenAddress, token0);
        expect(actualValue0).to.equal(90000);
        const actualValue1 = await dex.reserve(LPtokenAddress, token1);
        expect(actualValue1).to.equal(40000);
    });
    //確認LPtoken量
    it("check LPtokenAmount", async function (){
        const LPtokenCheck = await (Math.sqrt(token0_amount * token1_amount) * 10**8);
        const LPtokenAmount = await LPtokenInstance.balanceOf(owner.address);
        expect(LPtokenAmount).to.equal(LPtokenCheck);
    });
    //減少流動性
    it("minus liquidity", async function (){
        //添加流動性
        await dex.minusLiquidity(token0, token1, (30000 * 10**8));
        //取得減少流動性池子量
        const actualValue0 = await dex.reserve(LPtokenAddress, token0);
        expect(actualValue0).to.equal(45000);
        const actualValue1 = await dex.reserve(LPtokenAddress, token1);
        expect(actualValue1).to.equal(20000);
    });
    //執行兌換及增發
    it("swap", async function (){
        //原始流動性
        const actualValue0 = await dex.reserve(LPtokenAddress, token0);
        const actualValue1 = await dex.reserve(LPtokenAddress, token1);
        const liquidity = actualValue0 * actualValue1;
        //添加流動性
        await dex.swap(token0, token1, 40000);
        //新的流動性
        const newActualValue0 = await dex.reserve(LPtokenAddress, token0);
        const newActualValue1 = await dex.reserve(LPtokenAddress, token1);
        const NewLiquidity = newActualValue0 * newActualValue1;
        expect(NewLiquidity).to.above(liquidity);
        //項目方紀錄增發LPtoken
        const addLPtokenValue = await dex.checkLPtokenOwner(LPtokenAddress);
        expect(addLPtokenValue).to.above(0);
        //項目方執行增發LPtoken
        await dex.mintLPtokenForOwner(LPtokenAddress);
        const newAddLPtokenValue = await dex.checkLPtokenOwner(LPtokenAddress);
        expect(newAddLPtokenValue).to.equal(0);
        //確認是否發行代幣
        const LPtokenTotalSupply = await LPtokenInstance.totalSupply();
        expect(LPtokenTotalSupply).to.above(60000 * 10**8);
    });
    //測試開根號
    it("test sqrt", async function (){
        //添加流動性
        const answer = await dex._sqrt(900);
        //取得減少流動性池子量
        expect(answer).to.equal(30);
    });
});