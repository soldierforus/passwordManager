console.log('starting password manager');

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
      }
  }).help('help');
})
.help('help')
.argv;

var command = argv._[0]

function createAccount(account) {
  var accounts = storage.getItemSync('accounts');

  if (typeof accounts === 'undefined'){
    console.log('New set-up detected |Inititalizing|');
    accounts = [];
  }

  accounts.push (account);
  storage.setItemSync('accounts', accounts);

  return account;
}

function getAccount(accountName){
   var accounts = storage.getItemSync('accounts');
   var matchedAccount;

   accounts.forEach(function (account) {
     if (account.name === accountName) {
       matchedAccount = account;
     }
   });

   return matchedAccount;
 }

if (command === 'create') {
  var createdAccount = createAccount({
    name: argv.name,
    username: argv.username,
    password: argv.password
  });
  console.log('Account Created:  \n', createdAccount)
} else if (command === 'get') {
    var fetchedAccount = getAccount(argv.name);

    if (typeof fetchedAccount === 'undefinded') {
      console.log('account not found')
    } else {
        console.log('Account found:  \n', fetchedAccount);
    }
}
