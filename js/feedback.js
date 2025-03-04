document.addEventListener('DOMContentLoaded', () => {
  // Only run if on feedback page
  if(document.getElementById('feedback-items')){
    fetch('/api/feedback/all')
      .then(res => res.json())
      .then(data => {
        let html = '';
        data.feedbacks.forEach(item => {
          html += `<div class="feedback-item">
                    <h4>${item.distributorName}</h4>
                    <p>Rating: ${item.rating} Stars</p>
                    <p>${item.comment}</p>
                   </div>`;
        });
        document.getElementById('feedback-items').innerHTML = html;
      })
      .catch(err => console.error(err));
  }
});
