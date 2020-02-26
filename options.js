document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementsByTagName('form')[0]
    const keyInput = document.getElementsByTagName('input')[0];

    chrome.storage.sync.get({
        apiKey: ''
    }, (items) => {
        keyInput.value = items.apiKey;
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        var apiKey = keyInput.value;
        chrome.storage.sync.set({ apiKey }, function () {
            window.close()
        });
    });
});