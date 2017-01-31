var crypto = require('crypto-js');
var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
  .command('create', 'Creates a new account', function (yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: 'n',
        description: "name of account (eg twitter or facebook)",
        type: 'string'
      },
      username: {
        demand: true,
        alias: 'u',
        description: "username",
        type: 'string'
      },
      password: {
        demand: true,
        alias: 'p',
        description: "password",
        type: 'string'
      },
      masterPassword: {
        demand: true,
        alias: 'M',
        description: "Password required for Encryption",
        type: 'string'
      }
    }).help('help');
  })
  .command('get', 'Get an existing account', function (yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: 'n',
        description: "name of account (eg twitter or facebook)",
        type: 'string'
      },
      masterPassword: {
        demand: true,
        alias: 'M',
        description: "Password required for Decryption",
        type: 'string'
      }
  }).help('help');
})
.help('help')
.argv;

var command = argv._[0]

function getAccounts(masterPassword) {
  //fetch accounts
  var encryptedAccount = storage.getItemSync('accounts');
  var accounts = [];

  //decrypt
  if (typeof encryptedAccount !== 'undefined') {
    var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
    accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
  }
  //return accounts array
  return accounts;
}

function saveAccounts(accounts, masterPassword) {
  //encrypt accounts
  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

  //store accounts
  storage.setItemSync('accounts', encryptedAccounts.toString());
  //return account
  return accounts;

}

function createAccount(account, masterPassword) {
  var accounts = getAccounts(masterPassword)

  accounts.push(account);

  saveAccounts(accounts, masterPassword);

  return account;
}

function getAccount(accountName, masterPassword){
   var accounts = getAccounts(masterPassword);
   var matchedAccount;

   accounts.forEach(function (account) {
     if (account.name === accountName) {
       matchedAccount = account;
     }
   });

   return matchedAccount;
 }

if (command === 'create') {
  try {
    var createdAccount = createAccount({
      name: argv.name,
      username: argv.username,
      password: argv.password
    }, argv.masterPassword);
    console.log('\nAccount Created:  \n', createdAccount, '\n')
  } catch (e) {
    console.log('Unable to create account');
  }
} else if (command === 'get') {
  try {
    var fetchedAccount = getAccount(argv.name, argv.masterPassword);

    if (typeof fetchedAccount === 'undefined') {
      console.log('account not found');
    } else {
        console.log('Account found:  \n', fetchedAccount);
    }
  } catch (e) {
    console.log('Unable to get account');
  }
}
