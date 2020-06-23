const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const cliProgress = require('cli-progress');
const fs = require('fs');
const { argv } = require('yargs');

const utils = require('./utils');
const poolAbi = require('./abi/BPool.json');
const tokenAbi = require('./abi/BToken.json');

const web3 = new Web3(
    new Web3.providers.WebsocketProvider(`ws://localhost:8546`)
);

BigNumber.config({
    EXPONENTIAL_AT: [-100, 100],
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    DECIMAL_PLACES: 18,
});

function bnum(val) {
    return new BigNumber(val.toString());
}

const btc_holders = [
    '0xd4dbf96db2fdf8ed40296d8d104b371adf7dee12',
    '0x3230a79c196958980f058d0dbd5e6a5fd3ea1778',
    '0x2e2cee70d0540f3b87258fcec3c5acf354939d04',
    '0x5b97680e165b4dbf5c45f4ff4241e85f418c66c2',
    '0xd68a5ccde1e5273c79cd40711fe4750122cdd865',
    '0x0b5e26829B72654620cD431E685FD71ad956E58E',
    '0xca5cb9ef958774e60cea4f63d9fb0f5ad76f3dca',
    '0xa63d8bbb9b16d913976d8bd23a0dcfec2282bae5',
    '0xbd14576897bc0a294f22f4a90c639090edb315a8',
    '0x07f58c9792bc03443d7b96ed314800a911a11680',
    '0xb3a7fbc2fa38c18ad4433ae93fe7f215fd2d057f',
    '0x238b4496d974b7d3518ee6dc5aab8e2776ef9d6f',
    '0x4929f4d38f2955649b5aa34343da04cf790b9d92',
    '0x4059457092cc3812d56676df6a75fd21204fbe2f',
    '0xc96265c36f6d77747f9c259946a1ef55fce946b7',
    '0xf610d8c16f9b607642a9c5649078b445f48fcd31',
    '0xd08131920d9890343f5e2d02fa206a0167b1e235',
    '0xeee53e0240ce27ef9a01ce2789d6513b4493ebdf',
    '0xce3066df90ee06331e38d3cbc253d9abafa8e3cd',
    '0x68d36dcbdd7bbf206e27134f28103abe7cf972df',
    '0x75286e183d923a5f52f52be205e358c5c9101b09',
    '0x8bce57b7b84218397ffb6cefae99f4792ee8161d',
    '0x834da2e7bf0d17146efe4e01905c4ca6c14da3f4',
    '0xb3522064694ac9870dbf00eebc2712762193bb64',
    '0x3a70e8c00f3bcf3eb845b6b6928aba92b465c183',
    '0x381479aef601d864a0b3882e96e23438ff3011e5',
    '0xabf26352aadaaa1cabffb3a55e378bac6bf15791',
    '0x57266b3ad7f8c3aa6c9793eafbcd4652a6bdfac0',
    '0xf401a7c5469b54eaf88597b92c53a0ece91cc398',
    '0x51a1583335abb511d68ae6151eb5b7a3c7ef86ed',
    '0x3efd3391a0601eaa093647f911c653d77c11e3fd',
    '0xf4fc3ac40c6b3fad7dcb7d51f26d01610b890c00',
    '0x9fe067eb7c4a2f5e4ea046b5af6095f75072bbe2',
    '0xecfc6e2232bdf6c9ae42aeb2b123a760e45517d4',
    '0xa6663ccb24b28d5a568e9d4f56e59fc1dee96d59',
    '0xaff5ccb996125dee3c12fbe4910b418c138646d0',
    '0x3111b7716dcc3ddf8509b3efc320488e9e39faca',
    '0x77f1894552a6336bd0fb2f0e904d30858f67cfa4',
    '0x6b817156a65615f01949eae47cc66f2a1f2f2e7d',
    '0xa5d808eddd2212e20c294f9ee12e99f75b11fcfd',
    '0x2953d4a9c12906e5ab3cad627f8b52e3b7ffc963',
    '0x5999865518c9de250b820762130ff7a7119a4558',
    '0x444c996b74631763ce0c406fcbe9aa13d35f395e',
    '0x1e17a75616cd74f5846b1b71622aa8e10ea26cc0',
    '0x7cb12f7169faf17fd5d7d53c3095975d7789f181',
    '0xcf12d2b5bbd585bd92af9019d690459bb5872ccb',
    '0x18fa2ac3c88112e36eff15370346f9aff3161fd1',
    '0x03C2Bc72A3E007179E54fFb4563cc235beC8151a',
    '0xb6bc98f5d7f6ce3c0946f7675128ab673e6c5d41',
    '0xd4c7ac4e4ca65ab5540475066b1271fdcad414f1',
    '0x31876edc17ba00b071202d4e719fb7d86bcb9270',
    '0x6d328b8de10fd9bc0801d396377a6ddd784141fa',
    '0xe3f7d7bc656619d70000a2618881f62a85dc95e9',
    '0xbaa6de4acc1fe7f44e80c58ddf5a61f3c08e0c55',
    '0x672b8144fe28a33bfe9678e880ff2e78b4c82705',
    '0x80dd69eacfbf7629662fafd3442fdecc30a39297',
    '0x5376d18b8b2ebc4b3d4977f0a6c393d00f571ce4',
    '0xd764bb9822ee16097140031b017640e7a293e57f',
    '0x999d6c858de19b048312f77597788b950a2fb35e',
    '0xcb57c082893450408d432b5d0bc38def93b26040',
    '0x951763756df8811575f2c7f7cf8761b74147ea7d',
    '0xe1d1ddb84063c4c85315d25dc568261c2f83b8c7',
    '0x01c142e94c8837d62787576bcd6f82a7bfb34ac2',
    '0x4a23135b15417aedeaa7a48c5d5cd80c2b5df300',
    '0x3b59b33a49460c7d4609cf491ad6e946bef5a027',
    '0xf0b83cd46d3a2c08083813ce4a0004a050f7576d',
    '0xf49e51a14f708e57a126855687118f60abf39e7f',
    '0xd0c81e82abddf29c6505d660f5bebe60cdff03c5',
    '0xa901368aec255b1e6df31edf8aa735ff16bb12a8',
    '0xe6ea2c6742a5d4426d717d36fa8ba5318559e5c0',
    '0x5eda2dc136986fc88d4df5696bc464f96a20268a',
    '0xad8c540a8b291529a12bdde08bf352cdcfc76bc4',
    '0x1f0aef221b865213af9214cd6b4debfbc4ec4c1d',
    '0x555b28b4eda9d3592ffac55047df5c90483c0fc4',
    '0xb707bbb632d01a6901fc8fb66d076b9453570bdf',
    '0x693c188e40f760ecf00d2946ef45260b84fbc43e',
    '0x01e6fd0ae73d9194b19f9b376065577927a0d5f5',
    '0x68a17b587caf4f9329f0e372e3a78d23a46de6b5',
    '0xc5ccfe9a0c45f73475e747b30d816af6c6ad1970',
    '0x303b6c0d8608b6683caff4f7e1cfab556323ee35',
    '0xe98774abdd346742a7e68d962cc26933733ed012',
    '0xbc3a12b9c9db119cd0930eb2eb033e182141f43e',
];

const btc_address = '0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd';
const week_1 = bnum(6271.430272488392207776);
const week_2 = bnum(4607.896480639124861937);
const week_3 = bnum(4263.691130749818874164);

if (!argv.startBlock || !argv.endBlock || !argv.week) {
    console.log(
        'Usage: node index.js --week 1 --startBlock 10131642 --endBlock 10156690'
    );
    process.exit();
}

const END_BLOCK = argv.endBlock; // Closest block to reference time at end of week
const START_BLOCK = argv.startBlock; // Closest block to reference time at beginning of week
const WEEK = argv.week; // Week for mining distributions. Ex: 1

const BAL_PER_WEEK = week_3;
const BLOCKS_PER_SNAPSHOT = 64;
const BAL_PER_SNAPSHOT = BAL_PER_WEEK.div(
    bnum(Math.ceil((END_BLOCK - START_BLOCK) / 64))
); // Ceiling because it includes end block

async function getRewardsAtBlock(i) {
    let block = await web3.eth.getBlock(i);
    let bPool = new web3.eth.Contract(poolAbi, btc_address);

    let bptSupplyWei = await bPool.methods.totalSupply().call(undefined, i);
    let bptSupply = utils.scale(bptSupplyWei, -18);

    let userPools = {};
    let userLiquidity = {};

    for (const holder of btc_holders) {
        let userBalanceWei = await bPool.methods
            .balanceOf(holder)
            .call(undefined, i);
        let userBalance = utils.scale(userBalanceWei, -18);

        let userProportion = userBalance.div(bptSupply);

        userLiquidity[holder] = userProportion.times(BAL_PER_SNAPSHOT).dp(18);
    }

    return userLiquidity;
}

(async function () {
    for (i = END_BLOCK; i > START_BLOCK; i -= BLOCKS_PER_SNAPSHOT) {
        let blockRewards = await getRewardsAtBlock(i);
        let path = `piedao/${WEEK}/${i}`;
        utils.writeData(blockRewards, path);
    }
})();
