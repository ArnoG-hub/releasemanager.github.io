const socket = io();

function saveChange(element, type) {
    const value = element.value;
    const releaseId = element.closest('.release-box').querySelector('h2').innerText;

    const data = {
        releaseId: releaseId,
        type: type,
        value: value
    };

    fetch('/save-change', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:password')
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));

    console.log('Data to be saved:', data);

    if (type === 'progress') {
        updateProgress(element);
    }
}

function applyChange(change) {
    const releaseBox = document.querySelector(`.release-box h2:contains('${change.releaseId}')`).closest('.release-box');
    if (change.type === 'progress') {
        const progressInput = releaseBox.querySelector('.progress-input');
        progressInput.value = change.value;
        updateProgress(progressInput);
    } else if (change.type === 'changelog') {
        const changelogArea = releaseBox.querySelector('textarea');
        changelogArea.value = change.value;
    }
}

socket.on('initialize', (initialChanges) => {
    initialChanges.forEach(change => applyChange(change));
});

socket.on('change', (change) => {
    applyChange(change);
});

document.addEventListener('DOMContentLoaded', function() {
    var progressInputs = document.querySelectorAll('.progress-input');
    progressInputs.forEach(input => updateProgress(input));
});
