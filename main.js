const searchInput = document.getElementById('search-input');
const autocompleteList = document.getElementById('autocomplete-list');
const repositoryList = document.getElementById('repository-list');

const API_URL = 'https://api.github.com/search/repositories';
let debounceTimeout;
let removeButtonListeners = [];

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    const query = e.target.value.trim();

    if (query === '' || query === ' ') {
        autocompleteList.innerHTML = '';
        return;
    }

    debounceTimeout = setTimeout(() => {
        fetchGitHubRepositories(query);
    }, 400);
});

function fetchGitHubRepositories(query) {
    fetch(`${API_URL}?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
            const repositories = data.items.slice(0, 5);
            displayAutocomplete(repositories);
        })
        .catch((error) => console.error(error));
}

function displayAutocomplete(repositories) {
    autocompleteList.innerHTML = '';
    repositories.forEach((repo) => {
        const li = document.createElement('li');
        li.textContent = repo.full_name;
        li.addEventListener('click', () => {
            addRepository(repo);
            searchInput.value = ''; // Очищаем поле ввода
            autocompleteList.innerHTML = '';
        });
        autocompleteList.appendChild(li);
    });
}

function addRepository(repo) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Name: ${repo.name}</strong> Owner: ${repo.owner.login} <br> Stars: ${repo.stargazers_count}  <button class="remove-button">Remove</button>`;
    const removeButton = li.querySelector('.remove-button');
    removeButton.addEventListener('click', () => {
        repositoryList.removeChild(li);
        removeButton.removeEventListener('click', () => {});
        const index = removeButtonListeners.indexOf(removeButton);
        if (index !== -1) {
            removeButtonListeners.splice(index, 1);
        }
    });
    removeButtonListeners.push(removeButton);
    repositoryList.appendChild(li);
}