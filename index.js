window.addEventListener('load', async () => {
    await initVideo()

    const loader = document.getElementById('loader');
    loader.style.display = 'none';
})

async function initVideo() {
    try {
        const apiKey = await getApiKeyFromStorage();
        const videoData = await fetchVideoData(apiKey);
        const video = getRandomItem(videoData.videos);
        const file = getMaxResFile(video)

        await playVideo(file.link)
        setAuthor(video.user)

        const videoContainer = document.getElementsByTagName("figure")[0];
        videoContainer.style.opacity = 1;
    } catch (error) {
        console.error(error);

        if (error.status && error.status === 403) {
            showKeyError();
        } else {
            const defaultError = document.getElementById('defaultError');
            defaultError.style.display = 'initial';
        }
    }
}

function getApiKeyFromStorage() {
    return new Promise(resolve =>
        chrome.storage.sync.get({ apiKey: '' }, (items) => resolve(items.apiKey))
    )
}

async function fetchVideoData(apiKey) {
    const response = await fetch('http://api.pexels.com/videos/popular?per_page=20', {
        headers: {
            'Authorization': apiKey,
        }
    })
    if (response.status !== 200) {
        const error = new Error(response.statusText);
        error.status = response.status;
        throw error;
    }
    return response.json();
}

function getRandomItem(array) {
    const randomPosition = Math.round(Math.random() * (array.length - 1));
    return array[randomPosition];
}

function getMaxResFile(video) {
    const files = video.video_files
    files.sort((a, b) => b.width - a.width);
    return files[0];
}

function playVideo(url) {
    const videoElement = document.getElementsByTagName("video")[0];
    videoElement.src = url;
    videoElement.load();
    return new Promise(resolve => videoElement.addEventListener('loadeddata', resolve))
}

function setAuthor(author) {
    const authorLink = document.getElementsByTagName("a")[0];
    authorLink.innerText = author.name;
    authorLink.href = author.url;
}

function showKeyError() {
    const keyError = document.getElementById('keyError');
    const optionsLink = document.querySelector('#keyError > a');

    keyError.style.display = 'initial'
    optionsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    })
}