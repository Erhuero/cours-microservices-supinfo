let accounts = []
let nextId = 1;

export function createAccount(data) {
    const account = {
        id: nextId++,
        userId: data.userId,
        label:data.label,
        type: data.type,
        balance: 100,
        createdAt: new Date().toISOString()
    };

    accounts.push(account);
    return account;
}

export function getAccountsByUser(userId) {
    return accounts.filter(a => a.userId === userId);
}

export function getAccountById(accountId) {
    const account = accounts.find(a => a.id === accountId);
    if(!account) {
        throw { status: 404, message: "Compte non trouvé" };
    }
    return account;
}

export function updateAccount(accountId, data) {
    const index = accounts.findIndex(a => a.id === accountId);
    if (index === -1){
        throw { status: 404, message: "Compte non trouvé" };
    }
    accounts[index] = { ...accounts[index], ...data}
    return accounts[index];
}

export function deleteAccount(accountId) {
    const index = accounts.findIndex(a=> a.id === accountId);
    if(index === -1){
        throw { status: 404, message: "Compte non trouvé" };
    }
    accounts.splice(index, 1);
}

export function updateBalance(accountId, amount) {
    const account = getAccountById(accountId);
    account.balance += amount;
    return account;
}