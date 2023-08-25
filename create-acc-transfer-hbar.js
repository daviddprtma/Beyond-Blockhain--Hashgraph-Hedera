const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction} = require("@hashgraph/sdk");

require("dotenv").config();

const createAccTransferHbar = async () => {
 // Part 1 - Grab Hedera testnet account
 const myAccountId = process.env.MY_ACCOUNT_ID;
 const myPrivateKey = process.env.MY_PRIVATE_KEY;

 if (myAccountId == null || myPrivateKey == null) {
  throw new Error("account ID or Private key are missing");
 }

 const client = Client.forTestnet();
 client.setOperator(myAccountId, myPrivateKey);

 const newAccountPrivateKey = PrivateKey.generateED25519();
 const newAccountPublicKey = newAccountPrivateKey.publicKey;
 const newAccount = await new AccountCreateTransaction()
  .setKey(newAccountPublicKey)
  .setInitialBalance(Hbar.fromTinybars(1000))
  .execute(client);

  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;
  console.log("The new account ID is: " + newAccountId);
  

  const accountBalance = await new AccountBalanceQuery().setAccountId(newAccountId).execute(client);
  console.log("The new account starting balance is: " + accountBalance.hbars.toTinybars() + " TINYBARs");
  

  const sendHbar = await new TransferTransaction()
  .addHbarTransfer(myAccountId, Hbar.fromTinybars(-250)) // Sending account
  .addHbarTransfer(newAccountId, Hbar.fromTinybars(250)) // Receiving account
  .execute(client);

const transactionReceipt = await sendHbar.getReceipt(client);
console.log("Status of transfer transaction: " + transactionReceipt.status.toString());

const newAccountBalance = await new AccountBalanceQuery().setAccountId(newAccountId).execute(client);
console.log("The new account current balance is: " + newAccountBalance.hbars.toTinybars() + " TINYBARs");
console.log("Submission made by: David Pratama");
};

createAccTransferHbar();