const {expect} = require("chai");

describe("Add", function(){
    //前面是描述 後面是執行的方法
    it("should return the sum of two numbers", async function (){
        //尚未部署測試
        //const Add = await ethers.getContractFactory("Add");
        //const add = await Add.deploy();
        //假設已經部署 取得合約地址及實例化
        add = await ethers.getContractAt('Add','0x90697ccf3ecb75552672a007beed5d456315a425');
        const result = await add.add(2,3);
        expect(result).to.equal(5);
    });
});