// API endpoint
const API_URL = 'http://localhost:3000/api';

// Wallet data structure
let wallets = {};

// Fetch wallets from server
async function fetchWallets() {
    try {
        const response = await fetch(`${API_URL}/wallets`);
        const data = await response.json();
        wallets = data.reduce((acc, wallet) => {
            acc[wallet.currency] = wallet;
            return acc;
        }, {});
        updateWalletBalances();
    } catch (error) {
        console.error('Error fetching wallets:', error);
        showError('Failed to load wallets');
    }
}

// Transaction types
const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    TRANSFER: 'transfer',
    BUY: 'buy',
    SELL: 'sell'
};

// Initialize modals
document.addEventListener('DOMContentLoaded', () => {
    initializeModals();
    fetchWallets();
    attachEventListeners();
});

// Helper functions for notifications
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function initializeModals() {
    // Create modal container if it doesn't exist
    if (!document.querySelector('.modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        document.body.appendChild(modalContainer);
    }
}

function attachEventListeners() {
    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.classList[1];
            showTransactionModal(action);
        });
    });

    // More buttons
    document.querySelectorAll('.more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const walletCard = e.currentTarget.closest('.wallet-card');
            const currency = getCurrencyFromWalletCard(walletCard);
            showWalletOptions(currency, e.currentTarget);
        });
    });
}

function showTransactionModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let title = '';
    let content = '';
    
    switch(type) {
        case 'deposit':
            title = 'Deposit Crypto';
            content = createDepositForm();
            break;
        case 'withdraw':
            title = 'Withdraw Crypto';
            content = createWithdrawForm();
            break;
        case 'transfer':
            title = 'Transfer Crypto';
            content = createTransferForm();
            break;
        case 'buy':
            title = 'Buy Crypto';
            content = createBuyForm();
            break;
    }

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    document.querySelector('.modal-container').appendChild(modal);
    modal.style.display = 'flex';

    // Close button functionality
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });

    // Form submission
    const form = modal.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleTransaction(type, form);
            modal.remove();
        });
    }
}

function createDepositForm() {
    return `
        <form class="transaction-form">
            <div class="form-group">
                <label>Select Currency</label>
                <select name="currency" required>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="sol">Solana (SOL)</option>
                    <option value="ltc">Litecoin (LTC)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="amount" step="0.0001" required>
            </div>
            <button type="submit" class="submit-btn">Deposit</button>
        </form>
    `;
}

function createWithdrawForm() {
    return `
        <form class="transaction-form">
            <div class="form-group">
                <label>Select Currency</label>
                <select name="currency" required>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="sol">Solana (SOL)</option>
                    <option value="ltc">Litecoin (LTC)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="amount" step="0.0001" required>
            </div>
            <div class="form-group">
                <label>Withdrawal Address</label>
                <input type="text" name="address" required>
            </div>
            <button type="submit" class="submit-btn">Withdraw</button>
        </form>
    `;
}

function createTransferForm() {
    return `
        <form class="transaction-form">
            <div class="form-group">
                <label>From Currency</label>
                <select name="fromCurrency" required>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="sol">Solana (SOL)</option>
                    <option value="ltc">Litecoin (LTC)</option>
                </select>
            </div>
            <div class="form-group">
                <label>To Currency</label>
                <select name="toCurrency" required>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="sol">Solana (SOL)</option>
                    <option value="ltc">Litecoin (LTC)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="amount" step="0.0001" required>
            </div>
            <button type="submit" class="submit-btn">Transfer</button>
        </form>
    `;
}

function createBuyForm() {
    return `
        <form class="transaction-form">
            <div class="form-group">
                <label>Select Currency</label>
                <select name="currency" required>
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="sol">Solana (SOL)</option>
                    <option value="ltc">Litecoin (LTC)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount (USD)</label>
                <input type="number" name="amount" step="0.01" required>
            </div>
            <button type="submit" class="submit-btn">Buy</button>
        </form>
    `;
}

async function handleTransaction(type, form) {
    try {
        const formData = new FormData(form);
        const currency = formData.get('currency');
        const amount = parseFloat(formData.get('amount'));
        const toAddress = formData.get('toAddress');

        if (!currency || !amount || isNaN(amount)) {
            showError('Please fill in all required fields');
            return;
        }

        const wallet = wallets[currency];
        if (!wallet) {
            showError('Invalid currency selected');
            return;
        }

        // Send transaction to server
        const response = await fetch(`${API_URL}/transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                currency,
                amount,
                toAddress
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Transaction failed');
        }

        const updatedWallet = await response.json();
        wallets[currency] = updatedWallet;

        // Update UI
        updateWalletBalances();
        updateTransactionHistory();

        // Close modal
        const modal = form.closest('.modal');
        if (modal) {
            modal.remove();
        }

        showSuccess('Transaction completed successfully');
    } catch (error) {
        console.error('Transaction error:', error);
        showError(error.message);
    }
}

function updateWalletBalances() {
    Object.entries(wallets).forEach(([currency, wallet]) => {
        const walletCard = document.querySelector(`.wallet-card[data-currency="${currency}"]`);
        if (walletCard) {
            const balanceElement = walletCard.querySelector('.balance-info h2');
            const usdValueElement = walletCard.querySelector('.balance-info span');
            
            balanceElement.textContent = `${wallet.balance.toFixed(4)} ${currency.toUpperCase()}`;
            usdValueElement.textContent = `≈ $${(wallet.balance * wallet.price).toFixed(2)}`;
        }
    });
}

function updateTransactionHistory() {
    const tbody = document.querySelector('.transactions-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    // Combine all transactions
    const allTransactions = [];
    Object.entries(wallets).forEach(([currency, wallet]) => {
        wallet.history.forEach(tx => {
            allTransactions.push({ ...tx, currency });
        });
    });

    // Sort by timestamp
    allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Display top 3 transactions
    allTransactions.slice(0, 3).forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = createTransactionRow(tx);
        tbody.appendChild(row);
    });
}

function createTransactionRow(tx) {
    const getTypeIcon = (type) => {
        const icons = {
            deposit: 'deposit.svg',
            withdraw: 'withdraw.svg',
            transfer: 'transfer.svg',
            buy: 'buy.svg',
            sell: 'sell.svg'
        };
        return icons[type];
    };

    const formatAmount = (amount, type, currency) => {
        const prefix = type === 'deposit' || type === 'buy' ? '+' : '-';
        return `${prefix}${amount.toFixed(4)} ${currency.toUpperCase()}`;
    };

    const formatUsdValue = (amount, price) => {
        return `$${(amount * price).toFixed(2)}`;
    };

    return `
        <td>
            <div class="transaction-type ${tx.type}">
                <img src="images/icons/${getTypeIcon(tx.type)}" alt="${tx.type}">
                <span>${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
            </div>
        </td>
        <td>
            <div class="asset-info">
                <img src="images/crypto/${tx.currency}.svg" alt="${tx.currency}">
                <span>${tx.currency.toUpperCase()}</span>
            </div>
        </td>
        <td>
            <div class="amount-info ${tx.type === 'withdraw' ? 'negative' : 'positive'}">
                <span>${formatAmount(tx.amount, tx.type, tx.currency)}</span>
                <p>${formatUsdValue(tx.amount, wallets[tx.currency].price)}</p>
            </div>
        </td>
        <td><span class="status ${tx.status}">${tx.status}</span></td>
        <td>${new Date(tx.timestamp).toLocaleDateString()}</td>
        <td>
            <button class="view-btn">View</button>
        </td>
    `;
}

function showWalletOptions(currency, button) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <ul>
            <li data-action="copy-address">Copy Address</li>
            <li data-action="view-transactions">View Transactions</li>
            <li data-action="export-history">Export History</li>
        </ul>
    `;

    // Position menu
    const rect = button.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(menu);

    // Handle menu item clicks
    menu.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action) {
            handleWalletAction(action, currency);
        }
        menu.remove();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== button) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

function handleWalletAction(action, currency) {
    switch(action) {
        case 'copy-address':
            navigator.clipboard.writeText(wallets[currency].address)
                .then(() => alert('Address copied to clipboard!'))
                .catch(err => console.error('Failed to copy address:', err));
            break;

        case 'view-transactions':
            showTransactionHistory(currency);
            break;

        case 'export-history':
            exportTransactionHistory(currency);
            break;
    }
}

function showTransactionHistory(currency) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const transactions = wallets[currency].history;
    const transactionsList = transactions.map(tx => createTransactionRow(tx)).join('');

    modal.innerHTML = `
        <div class="modal-content wide">
            <div class="modal-header">
                <h2>${currency.toUpperCase()} Transaction History</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <table class="transactions-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Asset</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactionsList}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    document.querySelector('.modal-container').appendChild(modal);
    modal.style.display = 'flex';

    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
}

function exportTransactionHistory(currency) {
    const transactions = wallets[currency].history;
    const csvContent = [
        ['Type', 'Amount', 'USD Value', 'Status', 'Date', 'Transaction ID'].join(','),
        ...transactions.map(tx => [
            tx.type,
            `${tx.amount} ${currency.toUpperCase()}`,
            `$${(tx.amount * wallets[currency].price).toFixed(2)}`,
            tx.status,
            new Date(tx.timestamp).toLocaleDateString(),
            tx.id || '-'
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currency.toUpperCase()}_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
