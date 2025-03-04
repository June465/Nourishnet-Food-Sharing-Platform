const donations = []; // In-memory donation store
const orders = [];    // In-memory orders

exports.addDonation = (req, res) => {
  // In a real app, handle file upload etc.
  const donation = { 
    id: Date.now(), 
    ...req.body,
    createdAt: new Date()
  };
  donations.push(donation);
  res.json({ success: true, donation });
};

exports.placeOrder = (req, res) => {
  const order = { id: Date.now(), ...req.body, status: 'placed' };
  orders.push(order);
  res.json({ success: true, orderId: order.id });
};

exports.getActiveDonations = (req, res) => {
  // Filter donations based on use-by date (remove expired)
  const active = donations.filter(d => new Date(d.useBy) > new Date());
  res.json({ donations: active });
};
