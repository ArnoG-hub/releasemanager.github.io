// script.js

function saveChange(element, type) {
    const value = element.value;
    const releaseId = element.closest('.release-box').querySelector('h2').innerText;

    const data = {
        releaseId: releaseId,
        type: type,
        value: value
    };

    // Comment out or remove the fetch request for local testing
    // fetch('/save-change', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then(response => response.json())
    //   .then(data => console.log('Success:', data))
    //   .catch((error) => console.error('Error:', error));

    console.log('Data to be saved:', data);

    if (type === 'progress') {
        updateProgress(element);
    }
}

function toggleChangelog(button) {
    var changelogArea = button.parentNode.nextElementSibling;
    changelogArea.classList.toggle('hidden');
}

function showBugReport() {
    alert('Placeholder for bug report popup');
}

function addRelease() {
    var releaseContainer = document.querySelector('.release-container');
    var newReleaseBox = document.createElement('div');
    newReleaseBox.className = 'release-box';
    newReleaseBox.innerHTML = `
        <h2>New Release</h2>
        <div class="button-row">
            <button class="changelog-btn" onclick="toggleChangelog(this)">ChangeLog</button>
            <button class="bugreport-btn" onclick="showBugReport()">BugReport</button>
            <button class="add-release-btn" onclick="addRelease()">+</button>
            <button class="remove-release-btn" onclick="confirmRemoveRelease(this)">-</button>
            <button class="rename-release-btn" onclick="renameRelease(this)">Renommer</button>
        </div>
        <div class="changelog-area hidden">
            <textarea placeholder="Entrez les changements ici"></textarea>
        </div>
        <div class="progress-container">
            <input type="number" class="progress-input" min="0" max="100" value="50" onchange="saveChange(this, 'progress')">
            <progress class="progress-bar" value="50" max="100"></progress>
            <span class="progress-label">50%</span>
        </div>
    `;
    releaseContainer.appendChild(newReleaseBox);
}

function confirmRemoveRelease(button) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette release ?")) {
        var releaseBox = button.parentNode.parentNode;
        releaseBox.parentNode.removeChild(releaseBox);
    }
}

function renameRelease(button) {
    var releaseBox = button.parentNode.parentNode;
    var newName = prompt("Entrez le nouveau nom de la release :");
    if (newName !== null && newName.trim() !== "") {
        releaseBox.querySelector('h2').textContent = newName;
    }
}

function updateProgress(input) {
    var progressContainer = input.parentNode;
    var progressBar = progressContainer.querySelector('.progress-bar');
    var progressLabel = progressContainer.querySelector('.progress-label');
    var value = parseInt(input.value);

    if (isNaN(value) || value < 0) {
        value = 0;
    } else if (value > 100) {
        value = 100;
    }

    progressBar.value = value;
    progressLabel.textContent = value + '%';

    // Remove previous color classes
    progressBar.classList.remove('low', 'medium', 'high', 'full');

    // Add new color class based on value
    if (value <= 25) {
        progressBar.classList.add('low');
    } else if (value <= 50) {
        progressBar.classList.add('medium');
    } else if (value <= 75) {
        progressBar.classList.add('high');
    } else {
        progressBar.classList.add('full');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var progressInputs = document.querySelectorAll('.progress-input');
    progressInputs.forEach(input => updateProgress(input));
});
