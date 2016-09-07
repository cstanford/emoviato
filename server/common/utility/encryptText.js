/**
 * This script is used to encypt sensitive text.
 */
//arguments, slice off first two "node" and "encryptText"
const args = process.argv.slice(2);

if(!args[0] || args[0] === 'help' || args[0] === '?') {
    console.info('********************************************************************************************************');
    console.info('***************************************Data Encryption Help*********************************************');
    console.info('********************************************************************************************************');
    console.info('*  node encryptText usage                                                                              *');
    console.info('*      node encryptText "text to encrypt"                                                              *');
    console.info('*                                                                                                      *');
    console.info('*          Example:                                                                                    *');
    console.info('*          node encryptText "Some very special password that should be encrypted at rest."             *');
    console.info('********************************************************************************************************');
    console.info('********************************************************************************************************');
    process.exit(0);
}

const keyData = require('../config/keyfile.json');
const encryptor = require('simple-encryptor')(keyData.key);

const encrypted = encryptor.encrypt(args[0]);
// Should print gibberish:
console.log('encrypted: %s', encrypted);