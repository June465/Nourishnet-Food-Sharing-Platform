// Function to open the main feedback overlay (called from index.html)
async function openFeedbackOverlay() {
  const overlayDiv = document.getElementById('feedback-overlay');
  if (!overlayDiv) {
      console.error("Feedback overlay container not found!");
      return;
  }

  // Add class to body to potentially disable scrolling
  document.body.classList.add('overlay-active');

  try {
      const response = await fetch('feedback-overlay.html');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      overlayDiv.innerHTML = html;
      overlayDiv.style.display = 'flex'; // Use flex to center content

      // The feedback loading logic is now inside feedback-overlay.html's script
      // but we could trigger it from here if needed after insertion.
      // Example: if (typeof loadAllFeedbacks === 'function') loadAllFeedbacks();

  } catch (err) {
      console.error("Error loading or displaying feedback overlay:", err);
      overlayDiv.innerHTML = `<div style="background:white; padding:20px; border-radius:5px;">Error loading content. ${err.message} <button onclick="closeFeedbackOverlay()">Close</button></div>`;
      overlayDiv.style.display = 'flex';
  }
}

// Function to close the main feedback overlay (can be called from anywhere)
function closeFeedbackOverlay() {
  const overlayDiv = document.getElementById('feedback-overlay');
  if (overlayDiv) {
      overlayDiv.style.display = 'none';
      overlayDiv.innerHTML = ''; // Clear the content
  }
  // Remove class from body
  document.body.classList.remove('overlay-active');
}


// --- Functions for Collector Feedback Modal (on Collector Dashboard) ---

// Function to open the modal for submitting feedback for a SPECIFIC order
async function openCollectorFeedbackModal(orderId, distributorName = 'the Distributor') { // Pass order ID
  const modalDiv = document.getElementById('collector-feedback-modal');
  if (!modalDiv) return;

  document.body.classList.add('overlay-active');

  // Simple inline form for feedback
  modalDiv.innerHTML = `
      <div class="feedback-modal-content">
           <span class="close-btn" onclick="closeCollectorFeedbackModal()">&times;</span>
           <h4>Feedback for Order ${orderId}</h4>
           <p>How was your experience with ${distributorName}?</p>
           <form id="collector-feedback-form" onsubmit="submitCollectorFeedback(event, '${orderId}')">
               <div class="rating-input">
                  <span>Rating:</span>
                  <select name="rating" required>
                      <option value="">Select Stars</option>
                      <option value="5">★★★★★ (Excellent)</option>
                      <option value="4">★★★★☆ (Good)</option>
                      <option value="3">★★★☆☆ (Average)</option>
                      <option value="2">★★☆☆☆ (Poor)</option>
                      <option value="1">★☆☆☆☆ (Very Poor)</option>
                  </select>
               </div>
               <div class="comment-input">
                  <span>Comment:</span>
                  <textarea name="comment" rows="4" placeholder="Share your experience..." required></textarea>
               </div>
               <input type="hidden" name="orderId" value="${orderId}">
               <button type="submit" class="btn">Submit Feedback</button>
           </form>
           <div id="feedback-submit-message" style="margin-top: 10px;"></div>
      </div>
  `;
  modalDiv.style.display = 'flex';

  // Add some basic styling if needed within this modal specifically
  const style = document.createElement('style');
  style.textContent = `
      .feedback-modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 450px; position: relative; }
      .feedback-modal-content h4 { margin-bottom: 1rem; font-size: 1.5rem; }
      .feedback-modal-content .close-btn { position: absolute; top: 1rem; right: 1rem; font-size: 2rem; cursor: pointer; color: #aaa; }
      .feedback-modal-content .close-btn:hover { color: #555; }
      .feedback-modal-content form div { margin-bottom: 1rem; }
      .feedback-modal-content form span { display: block; margin-bottom: 5px; font-weight: 600; }
      .feedback-modal-content form select, .feedback-modal-content form textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
      .feedback-modal-content form textarea { resize: vertical; }
      .feedback-modal-content .btn { width: 100%; margin-top: 1rem; }
  `;
  modalDiv.appendChild(style);

}

// Function to close the collector's feedback submission modal
function closeCollectorFeedbackModal() {
  const modalDiv = document.getElementById('collector-feedback-modal');
  if (modalDiv) {
      modalDiv.style.display = 'none';
      modalDiv.innerHTML = '';
  }
  document.body.classList.remove('overlay-active');
}

// Function to handle the submission of collector feedback
async function submitCollectorFeedback(event, orderId) {
  event.preventDefault();
  const form = event.target;
  const rating = form.rating.value;
  const comment = form.comment.value;
  const messageDiv = document.getElementById('feedback-submit-message');

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
      messageDiv.textContent = 'Error: You must be logged in.';
      messageDiv.style.color = 'red';
      return;
  }

  const feedbackData = {
      orderId: orderId,
      collectorId: user._id, // Make sure your user object has _id
      rating: parseInt(rating),
      comment: comment
  };

  try {
      const response = await fetch('/api/feedback/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData)
      });
      const result = await response.json();

      if (result.success) {
          messageDiv.textContent = 'Feedback submitted successfully! Thank you.';
          messageDiv.style.color = 'green';
          form.reset();
          // Disable the feedback button on the dashboard for this order
          const feedbackButton = document.querySelector(`.feedback-btn[data-order-id="${orderId}"]`);
          if (feedbackButton) {
              feedbackButton.textContent = 'Feedback Submitted';
              feedbackButton.disabled = true;
              feedbackButton.style.opacity = '0.6';
              feedbackButton.style.cursor = 'not-allowed';
          }
          // Optionally close the modal after a delay
          setTimeout(closeCollectorFeedbackModal, 2000);
      } else {
          messageDiv.textContent = `Error: ${result.message}`;
          messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error("Error submitting feedback:", err);
      messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      messageDiv.style.color = 'red';
  }
}