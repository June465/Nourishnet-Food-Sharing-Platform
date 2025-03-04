// Open the order overlay and populate details (orderId can be used to fetch donation details)
function openOrderOverlay(donationId) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) {
      window.location.href = "login.html";
      return;
    }
    // For demo, populate static details; in real app, fetch donation details via AJAX
    document.getElementById('order-details').innerHTML = `
      <p>Servings: 50</p>
      <p>Pickup Time: 10:00 AM - 12:00 PM</p>
      <p>Location: Downtown Community Center</p>
      <p>Use By: 2025-03-10T12:00</p>
    `;
    document.getElementById('order-overlay').innerHTML = ''; // Clear previous content if any
    // Load the order.html content via fetch (or you can simply display a hidden div)
    fetch('order.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('order-overlay').innerHTML = html;
        document.getElementById('order-overlay').style.display = 'block';
      });
  }
  
  function closeOrderOverlay() {
    document.querySelector('.order-overlay').style.display = 'none';
  }
  
  function submitOrder(event) {
    event.preventDefault();
    // Gather order data from the form
    const form = event.target;
    const orderData = Object.fromEntries(new FormData(form));
    // Simulate sending order to backend
    fetch('/api/donations/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(data => {
      // Show order summary and thank you message
      const summaryDiv = document.getElementById('order-summary');
      summaryDiv.innerHTML = `<h3>Thank You!</h3><p>Your order has been placed. Order ID: ${data.orderId}</p>`;
      summaryDiv.classList.remove('hidden');
      form.style.display = 'none';
    })
    .catch(err => console.error(err));
  }
  