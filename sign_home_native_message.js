const jsutil = require('ethereumjs-util');

console.log(process.argv);

if (process.argv.length <= 3) {
    console.log(process.argv);
    console.error('ERROR: Insufficient number of arguments');
    console.error('Usage: node sign_home_native_message.js <keyIndex> <...message parts>');
    process.exit(1);
}

const keyPairs = require('./keys.json').keypair;
const signingKeyIndex = process.argv[2];

if ((signingKeyIndex < 0) || (signingKeyIndex >= keyPairs.length)) {
    console.error(`ERROR: Key index out of range [0,${keyPairs.length - 1}]`);
    process.exit(1);
}

var signingKey = keyPairs[signingKeyIndex].privateKeyString;
if (signingKey.startsWith('0x')) {
    signingKey = signingKey.substring(2);
}

const messageParts = process.argv.slice(3);
const message = Buffer.from(messageParts.map(a => a.toString()).join(' '));

const messageHash = jsutil.hashPersonalMessage(message);
const keyBuffer = Buffer.from(signingKey, 'hex');
const signature = jsutil.ecsign(messageHash, keyBuffer);

console.log("Signature v: " + signature.v);
console.log("Signature r (base64): " + signature.r.toString("base64"));
console.log("Signature s (base64): " + signature.s.toString("base64"));
