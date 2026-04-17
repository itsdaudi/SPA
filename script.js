//DOM Elements
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const wordElement = document.getElementById('word');
const phoneticElement = document.getElementById('phonetic');
const audioElement = document.getElementById('audio');

const resultsContainer = document.getElementById('results');
const definitionList = document.getElementById('definition-list');
const errorMessage = document.getElementById('error-message');
const meaningsContainer = document.getElementById('meanings-container');
//Event Listener-Maintaining the state of the application
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchWord = input.value.trim();
    if (searchWord === '') {
        showError('Please enter a word to search.');
        return;
    }
    await fetchWordData(searchWord);
});
//fetch API with error handling
async function fetchWordData(word) {
    showLoading();
    hideError();

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`"${word}" not found. Please try another word.`);
            } else {
                throw new Error('An error occurred while fetching data. Please try again later.');
            }               
        }

        const data = await response.json();
        displayWordData(data);

    } catch (error) {
        showError(error.message);
        resultsContainer.classList.add('hidden');
    }
}
//dynamic DOM manipulation ,create new elements for each definition
function displayWordData(data) {
    //clear previous results
    meaningsContainer.innerHTML = '';

    //display word info
    wordElement.textContent = data[0]?.word || 'N/A';
    phoneticElement.textContent = data[0]?.phonetic || 'N/A';

    //handle audio pro
    const audioUrl = data[0]?.phonetics?.find(p => p.audio)?.audio;
    if (audioUrl && audioUrl !== '') {
        audioElement.src = audioUrl;
        audioElement.classList.remove('hidden');
    }
    else {
        audioElement.classList.add('hidden');
    }
    //loop through meanings and create elements for each definition

    const meanings = data[0]?.meanings || [];
    if (meanings.length === 0) {
        meaningsContainer.innerHTML= '<p>No meanings found.</p>';
    }
    else {
        meanings.forEach(meaning => {
            //create elements for part of speech
            const meaningCard = document.createElement('div');
            meaningCard.className = 'meaning-card';
            //part of speech
            const partOfSpeechHeading = document.createElement('h3');
            partOfSpeechHeading.textContent = meaning.partOfSpeech || 'N/A';
            meaningCard.appendChild(partOfSpeechHeading);
            //definitions list
            const definitionsList = document.createElement('li');
            //definitions text
            const defText = document.createElement('strong');
            defText.textContent = 'Definition ${index + 1}: ';
            definitionsList.appendChild(defText);
            definitionsList.appendChild(document.createTextNode(def.definition || 'N/A'));

            //add example if available
            if (def.example) {
                const exampleText = document.createElement('p');
                exampleText.className = 'Example-text';
                exampleText.textContent = 'Example: ${def.example}';
                definitionsList.appendChild(exampleText);
            }
            //add synonyms if available
            if (def.synonyms && def.synonyms.length > 0) {
                const synonymsText = document.createElement('p');
                synonymsText.className = 'synonyms-text';
                synonymsText.textContent = 'Synonyms: ${def.synonyms.join(', ')}';
                definitionsList.appendChild(synonymsText);
            }
            definitionList.appendChild(definitionsList);
        });

            meaningCard.appendChild(definitionList);
            meaningsContainer.appendChild(meaningCard);
    }
    //show result
    resultsContainer.classList.remove('hidden');
}
// UX functions
function showLoading() {
    resultsContainer.classList.remove('hidden');
    meaningsContainer.innerHTML = '<div class="loading">Loading...</div>';
    wordElement.textContent = '';
    phoneticElement.textContent = '';
    hideError();
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}