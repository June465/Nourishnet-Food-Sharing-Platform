// File: js/overlay.js

function openFeedbackOverlay() {
  fetch('feedback-overlay.html')
    .then(response => response.text())
    .then(html => {
      const overlayDiv = document.getElementById('feedback-overlay');
      overlayDiv.innerHTML = html;
      overlayDiv.style.display = 'block';
    })
    .catch(err => console.error(err));
}
