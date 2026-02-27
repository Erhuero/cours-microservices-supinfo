import * as accountService from './account.service.js';
import * as notificationService from './notification.service.js';

let transactions = [];
let nextId = 1;

export function createTransaction(data) {

    const fromAccount = accountService.getAccountByIdOnly(data.fromAccountId);
    const toAccount = accountService.getAccountByIdOnly(data.toAccountId);

    if (data.fromAccountId === data.toAccountId){
        throw { status: 400, message: "Impossible de transférer vers le même compte" };
    }

    if (fromAccount.balance < data.amount){
        throw { status: 400, message: "Solde insuffisant" };
    }

    fromAccount.balance -= data.amount;
    toAccount.balance += data.amount;

    const transaction = {
        id: nextId++,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        amount: data.amount,
        description: data.description || null,
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    notificationService.notifyTransfer(transaction, fromAccount, toAccount);
    return transaction;
}

export function getAllTransactions(){
    return transactions;
}


export function getTransactionsByAccount(accountId) {
    return transactions.filter(
        t => t.fromAccountId === accountId || t.toAccountId === accountId
    );
}