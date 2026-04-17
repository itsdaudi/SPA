const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const wordElement = document.getElementById('word');
const phoneticElement = document.getElementById('phonetic');
const audioElement = document.getElementById('audio');
const meaningElement = document.getElementById('meaning');
const errorDiv = document.getElementById('error');
const synonymsElement = document.getElementById('synonyms');
const partOfSpeechElement = document.getElementById('part-of-speech');
const exampleElement = document.getElementById('example');
const definitionElement = document.getElementById('definition');

const resultsContainer = document.getElementById('results');
const definitionList = document.getElementById('definition-list');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fetchWord = input.value.trim();
    await fetchWordData(fetchWord);
});

async function fetchWordData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found. Please try another word.');
        }
        const data = await response.json();
        displayWordData(data);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}


function displayWordData(data) {
    wordElement.textContent = data.word || 'N/A';
    phoneticElement.textContent = data.phonetic || 'N/A';

    const meanings = data.meanings || [];
    const definitions = meanings[0]?.definitions || [];

    meaningElement.textContent = definitions[0]?.definition || 'N/A';
    partOfSpeechElement.textContent = meanings[0]?.partOfSpeech || 'N/A';
    exampleElement.textContent = definitions[0]?.example || 'N/A';

    const synonyms = definitions[0]?.synonyms || [];
    synonymsElement.textContent = synonyms.length > 0 ? synonyms.join(', ') : 'N/A';

    const audioUrl = data.phonetics?.find(p => p.audio)?.audio;
    if (audioUrl) {
        audioElement.src = audioUrl;
    }
    
}    