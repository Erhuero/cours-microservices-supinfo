const API_URL ='http://localhost:3000';

async function callApi(path){
    const response = await fetch(`${API_URL}${path}`);
    if(!response.ok){
        throw{ status: response.status, message: `Erreur API: ${response.statusText}` };
    }
    return response.json();
}

export async function getAllUsers(){
    return callApi('/users');
}

export async function getUserById(id){
    return callApi(`/users/${id}`);
}

export async function getAccountsByUser(userId) {
    return callApi(`/users/${userId}/accounts`);
}

export async function getAllTransactions() {
    return callApi('/transactions');
}

export async function getFullOverview() {

    const users = await getAllUsers();

    const overview = await Promise.all(
        users.map(async (user) => {
            const accounts = await getAccountsByUser(user.id);
            return { ...user, accounts };
        })
    );

    const transactions = await getAllTransactions();
    return { users: overview, transactions}
}