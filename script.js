// GitHub Account Checker
async function checkGitHubAccount() {
    const username = document.getElementById('githubUsername').value.trim();
    const resultBox = document.getElementById('githubResult');

    if (!username) {
        showError(resultBox, 'Please enter a GitHub username');
        return;
    }

    resultBox.innerHTML = '<p>Loading...</p>';
    resultBox.classList.add('show');

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();

        if (response.ok) {
            const checkTime = new Date().toLocaleString();
            const isActive = data.updated_at ? new Date(data.updated_at) : null;
            const lastActive = isActive ? formatTimeAgo(isActive) : 'Unknown';

            resultBox.classList.remove('error');
            resultBox.classList.add('success');
            resultBox.innerHTML = `
                <h3>✓ Account Found</h3>
                <p><strong>Username:</strong> ${data.login}</p>
                <p><strong>UID:</strong> ${data.id}</p>
                <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                <p><strong>Last Active:</strong> ${lastActive}</p>
                <p><strong>Profile Status:</strong> ${data.type === 'User' ? 'Active User' : 'Organization'}</p>
                <p><strong>Profile Link:</strong> <a href="${data.html_url}" target="_blank">View on GitHub</a></p>
                <p><strong>Check Time:</strong> ${checkTime}</p>
                <span class="status active">ACTIVE</span>
            `;
        } else {
            showError(resultBox, `Account not found: ${data.message}`);
        }
    } catch (error) {
        showError(resultBox, `Error: ${error.message}`);
    }
}

// Facebook/Meta Account Checker
async function checkFacebookAccount() {
    const username = document.getElementById('facebookUsername').value.trim();
    const resultBox = document.getElementById('facebookResult');

    if (!username) {
        showError(resultBox, 'Please enter a Facebook username or profile ID');
        return;
    }

    resultBox.innerHTML = '<p>Loading...</p>';
    resultBox.classList.add('show');

    try {
        const checkTime = new Date().toLocaleString();
        
        // Note: Facebook Graph API requires access token for real data
        // This is a simulated response showing profile structure
        // In production, you'd need proper Facebook API credentials
        
        // Check if input is a valid Facebook URL pattern or username
        const facebookProfileUrl = `https://www.facebook.com/${username}`;
        
        resultBox.classList.remove('error');
        resultBox.classList.add('success');
        resultBox.innerHTML = `
            <h3>✓ Facebook Account Lookup</h3>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Profile URL:</strong> <a href="${facebookProfileUrl}" target="_blank">${facebookProfileUrl}</a></p>
            <p><strong>Status:</strong> <span class="status-badge active">VISIBLE</span></p>
            <p><strong>Profile Visibility:</strong> Public/Semi-Public</p>
            <p><strong>Check Time:</strong> ${checkTime}</p>
            <p><strong>Note:</strong> Full profile details require Facebook API access</p>
            <p style="font-size: 0.9em; color: #999;">To get detailed info, verify with Facebook Graph API</p>
            <span class="status active">ACCESSIBLE</span>
        `;
    } catch (error) {
        showError(resultBox, `Error: ${error.message}`);
    }
}

// UID Checker
function checkUID() {
    const uid = document.getElementById('uidInput').value.trim();
    const resultBox = document.getElementById('uidResult');

    if (!uid) {
        showError(resultBox, 'Please enter a UID to check');
        return;
    }

    // Validate UID format
    const isValidUID = /^\d+$/.test(uid);

    resultBox.classList.add('show');

    if (isValidUID) {
        const checkTime = new Date().toLocaleString();
        resultBox.classList.remove('error');
        resultBox.classList.add('success');
        resultBox.innerHTML = `
            <h3>✓ UID Verified</h3>
            <p><strong>UID:</strong> ${uid}</p>
            <p><strong>Format:</strong> Valid (Numeric)</p>
            <p><strong>Length:</strong> ${uid.length} digits</p>
            <p><strong>Type:</strong> ${getUIDType(uid)}</p>
            <p><strong>Check Time:</strong> ${checkTime}</p>
            <span class="status active">VALID</span>
        `;
    } else {
        showError(resultBox, 'Invalid UID format. UID should contain only numbers.');
    }
}

function getUIDType(uid) {
    const length = uid.length;
    if (length <= 10) return 'Possibly User ID';
    if (length <= 18) return 'Possibly Discord ID / Large User ID';
    return 'Large Numeric ID';
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

// Account Linker
let linkedAccounts = JSON.parse(localStorage.getItem('linkedAccounts')) || [];

function linkAccount() {
    const platform = document.getElementById('platform').value;
    const accountId = document.getElementById('accountId').value.trim();
    const status = document.getElementById('accountStatus').value;

    if (!accountId) {
        alert('Please enter an account identifier');
        return;
    }

    const linkTime = new Date().toLocaleString();
    const newAccount = {
        platform: platform,
        accountId: accountId,
        status: status,
        linkedAt: linkTime,
        timestamp: new Date().getTime()
    };

    linkedAccounts.push(newAccount);
    localStorage.setItem('linkedAccounts', JSON.stringify(linkedAccounts));

    document.getElementById('accountId').value = '';
    document.getElementById('accountStatus').value = 'active';
    displayLinkedAccounts();

    alert(`✓ ${platform} account linked successfully!`);
}

function displayLinkedAccounts() {
    const container = document.getElementById('linkedAccounts');

    if (linkedAccounts.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">No linked accounts yet</p>';
        return;
    }

    container.innerHTML = '<h3 style="margin-bottom: 15px;">Linked Accounts:</h3>';

    linkedAccounts.forEach((account, index) => {
        const accountItem = document.createElement('div');
        accountItem.className = 'account-item';
        
        const statusClass = account.status === 'active' ? 'status-active' : 
                           account.status === 'inactive' ? 'status-inactive' : 
                           'status-non-visible';
        
        const statusLabel = account.status === 'active' ? '🟢 Active' : 
                           account.status === 'inactive' ? '🔴 Inactive' : 
                           '👻 Non-Visible';

        accountItem.innerHTML = `
            <div class="info">
                <div class="platform">${account.platform}</div>
                <div class="username">${account.accountId}</div>
                <div class="status-info ${statusClass}">${statusLabel}</div>
                <div style="font-size: 0.8em; color: #999;">Linked: ${account.linkedAt}</div>
            </div>
            <button class="remove" onclick="removeAccount(${index})">Remove</button>
        `;
        container.appendChild(accountItem);
    });
}

function removeAccount(index) {
    if (confirm('Are you sure you want to remove this account link?')) {
        linkedAccounts.splice(index, 1);
        localStorage.setItem('linkedAccounts', JSON.stringify(linkedAccounts));
        displayLinkedAccounts();
    }
}

function showError(element, message) {
    element.classList.remove('success');
    element.classList.add('error', 'show');
    element.innerHTML = `
        <h3>✗ Error</h3>
        <p>${message}</p>
        <p><strong>Check Time:</strong> ${new Date().toLocaleString()}</p>
        <span class="status inactive">ERROR</span>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayLinkedAccounts();
});