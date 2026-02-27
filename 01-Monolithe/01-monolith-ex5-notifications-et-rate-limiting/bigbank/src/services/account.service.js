import * as userService from './user.service.js';

let accounts = []
let nextId = 1;

export function createAccount(userId, data) {

    userService.getUserById(userId);

    const account = {
        id: nextId++,
        userId,
        label: data.label,
        type: data.type,
        balance: 100,
        createdAt: new Date().toISOString()
    };

    accounts.push(account);
    return account;
}

export function getAccountsByUser(userId) {

    userService.getUserById(userId);
    return accounts.filter(a => a.userId === userId);
}

export function getAccountById(userId, accountId) {

    userService.getUserById(userId);

    const account = accounts.find(a => a.id === accountId && a.userId === userId);
    if (!account){
        throw { status: 404, message: "Compte non trouvé" };
    }
    return account;
}

export function updateAccount(userId, accountId, data){

    userService.getUserById(userId);
    const index = accounts.findIndex(a => a.id === accountId && a.userId === userId);
    if (index === -1) {
        throw { status : 404, message: "Compte non trouvé"};
    }

    accounts[index] = { ...accounts[index], ...data };
    return accounts[index];
}

export function deleteAccount(userId, accountId) {

    userService.getUserById(userId);

    const index = accounts.findIndex(a => a.id === accountId && a.userId === userId);
    if(index === -1) {
        throw { status: 404, message: "Compte non trouvé"};
    }

    accounts.splice(index, 1);
}

export function getAccountByIdOnly(accountId) {

    const account = accounts.find(a => a.id === accountId);
    if(!account){
        throw { status: 404, message: "Compte non trouvé"};
    }

    return account
}