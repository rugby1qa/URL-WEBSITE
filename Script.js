async function shortURL() {
    const originalUrl = document.getElementById("url").value;

    // Show loading spinner
    document.getElementById("loading").classList.remove("hidden");

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);

        if (response.ok) {
            const shortUrl = await response.text();
            document.getElementById('result').innerHTML = `
            Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;

            // Save to history
            addToHistory({ originalUrl, shortUrl });
            
            // Clear the input field after shortening
            document.getElementById("url").value = "";

            // Update the history display
            updateHistoryDisplay();
        } else {
            document.getElementById('result').innerHTML = "Error shortening";
        }
    } finally {
        // Hide loading spinner (whether request succeeds or fails)
        document.getElementById("loading").classList.add("hidden");
    }
}

function addToHistory({ originalUrl, shortUrl }) {
    // Retrieve existing history from local storage
    const existingHistory = JSON.parse(localStorage.getItem('urlShortenerHistory')) || [];

    // Add the new entry to history
    existingHistory.push({ originalUrl, shortUrl });

    // Save updated history to local storage
    localStorage.setItem('urlShortenerHistory', JSON.stringify(existingHistory));
}


function updateHistoryDisplay() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';

    // Retrieve history from local storage
    const history = JSON.parse(localStorage.getItem('urlShortenerHistory')) || [];

    // Display each entry in reverse order (from most recent to oldest)
    for (let i = history.length - 1; i >= 0; i--) {
        const entry = history[i];
        historyContainer.innerHTML += `
            <div>
                <strong>Original URL:</strong> <br>${formatText(entry.originalUrl)}<br>
                <strong>Shortened URL:</strong> <a href="${entry.shortUrl}" target="_blank">${entry.shortUrl}</a>
                <button onclick="confirmDelete(${i})" class="delete-button">X</button>
            </div>
            <hr>
        `;
    }
}


// Function to confirm deletion
function confirmDelete(index) {
    const confirmation = window.confirm("Are you sure you want to delete this entry?");
    if (confirmation) {
        deleteHistoryEntry(index);
        updateHistoryDisplay();
    }
}

// Function to delete a history entry
function deleteHistoryEntry(index) {
    const history = JSON.parse(localStorage.getItem('urlShortenerHistory')) || [];
    history.splice(index, 1); // Remove the entry at the specified index
    localStorage.setItem('urlShortenerHistory', JSON.stringify(history));
}


function formatText(text) {
    const maxLineLength = 30; // Adjust this value based on your preference
    let formattedText = '';

    for (let i = 0; i < text.length; i += maxLineLength) {
        formattedText += text.substring(i, i + maxLineLength) + '<br>';
    }

    return formattedText;
}

function toggleHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.classList.toggle('hidden');
    updateHistoryDisplay(); // Update the history when toggling visibility
}



