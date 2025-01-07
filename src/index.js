const quoteList = document.getElementById('quote-list');
const newQuoteForm = document.getElementById('new-quote-form');

// Fetch quotes from the server and render them
function fetchQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
      quoteList.innerHTML = '';
      quotes.forEach(renderQuote);
    });
}

// Render a single quote
function renderQuote(quote) {
  const li = document.createElement('li');
  li.classList.add('quote-card');
  
  li.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-quote-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger' data-quote-id="${quote.id}">Delete</button>
      <button class='btn-warning' data-quote-id="${quote.id}">Edit</button>
    </blockquote>
  `;
  
  quoteList.appendChild(li);
  
  // Add event listeners for like, delete, and edit buttons
  li.querySelector('.btn-success').addEventListener('click', handleLike);
  li.querySelector('.btn-danger').addEventListener('click', handleDelete);
  li.querySelector('.btn-warning').addEventListener('click', handleEdit);
}

// Add new quote
newQuoteForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const quoteInput = document.getElementById('new-quote');
  const authorInput = document.getElementById('author');
  
  const newQuote = {
    quote: quoteInput.value,
    author: authorInput.value
  };
  
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newQuote)
  })
    .then(response => response.json())
    .then(quote => {
      renderQuote(quote);
      quoteInput.value = '';
      authorInput.value = '';
    });
});

// Handle like action
function handleLike(event) {
  const quoteId = event.target.dataset.quoteId;
  
  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quoteId })
  })
    .then(() => fetchQuotes());  // Re-fetch quotes to update like count
}

// Handle delete action
function handleDelete(event) {
  const quoteId = event.target.dataset.quoteId;
  
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'DELETE'
  })
    .then(() => fetchQuotes());  // Re-fetch quotes after deletion
}

// Handle edit action
function handleEdit(event) {
  const quoteId = event.target.dataset.quoteId;
  const quoteCard = event.target.closest('.quote-card');
  const quoteText = quoteCard.querySelector('.blockquote p').innerText;
  const authorText = quoteCard.querySelector('.blockquote-footer').innerText;
  
  const quoteInput = document.getElementById('new-quote');
  const authorInput = document.getElementById('author');
  
  quoteInput.value = quoteText;
  authorInput.value = authorText;
  
  newQuoteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const updatedQuote = {
      quote: quoteInput.value,
      author: authorInput.value
    };
    
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedQuote)
    })
      .then(() => fetchQuotes());
  });
}

// Initialize the app
fetchQuotes();
