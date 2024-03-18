

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
});

const inspector = require('inspector');

const debug = inspector.url() !== undefined

console.debug = (...args) => {
    if (debug) {
        console.log(...args)
    }
}


// 给定N个字符串S1,S2…SN，接下来进行M次询问，每次询问给定一个字符串T，求S1～SN中有多少个字符串是T的前缀。输入字符串的总长度不超过106，仅包含小写字母。 字符串 S1（不妨假设长度为 n）被称为字符串 S2 的前缀，当且仅当：S2 的长度不小于 n，且 S1 与 S2 前 n 个字符组组成的字符串完全相同。
function solve(/** @type {number[][]} */ players,/**@type {number[][]} */ edges) {

}


// 给定N个字符串S1,S2…SN，接下来进行M次询问，每次询问给定一个字符串T，求S1～SN中有多少个字符串是T的前缀。输入字符串的总长度不超过106，仅包含小写字母。 字符串 S1（不妨假设长度为 n）被称为字符串 S2 的前缀，当且仅当：S2 的长度不小于 n，且 S1 与 S2 前 n 个字符组组成的字符串完全相同。s
const processInput = (lines) => {
    
};

const readInputLines = async () => {
    const lines = [];
    for await (const line of rl) {
        lines.push(line);
    }
    return lines;
};

readInputLines().then(lines => {
    processInput(lines);
});