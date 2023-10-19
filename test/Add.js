const {expect} = require("chai");

describe("Add", function(){
    //前面是描述 後面是執行的方法
    it("should return the sum of two numbers", async function (){
        const Add = await ethers.getContractFactory("Add");
        const add = await Add.deploy();

        const result = await add.add(2,3);
        expect(result).to.equal(5);
    });
});