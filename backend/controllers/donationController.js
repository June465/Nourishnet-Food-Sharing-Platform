const { Storage } = require('@google-cloud/storage');
const path = require('path');
const db = require('../firebase');

// Initialize Google Cloud Storage client
const storage = new Storage();
// Use environment variable GCLOUD_BUCKET or replace with your bucket name
const bucketName = process.env.GCLOUD_BUCKET || 'your-bucket-name';

exports.addDonation = async (req, res) => {
  try {
    let foodImageUrl = '';
    if (req.file) {
      const blob = storage.bucket(bucketName).file(Date.now() + path.extname(req.file.originalname));
      const blobStream = blob.createWriteStream({
        resumable: false
      });
      blobStream.on('error', (err) => {
        console.error('Upload error:', err);
        return res.status(500).json({ success: false, message: 'File upload error' });
      });
      blobStream.on('finish', async () => {
        foodImageUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        const donation = { 
          distributor: req.body.distributor,
          foodType: req.body.foodType,
          allergy: req.body.allergy,
          quantity: req.body.quantity,
          location: req.body.location,
          pickupTime: req.body.pickupTime,
          useBy: new Date(req.body.useBy),
          foodImage: foodImageUrl,
          createdAt: new Date()
        };
        const docRef = await db.collection('donations').add(donation);
        donation.id = docRef.id;
        return res.json({ success: true, donation });
      });
      blobStream.end(req.file.buffer);
    } else {
      const donation = { 
        distributor: req.body.distributor,
        foodType: req.body.foodType,
        allergy: req.body.allergy,
        quantity: req.body.quantity,
        location: req.body.location,
        pickupTime: req.body.pickupTime,
        useBy: new Date(req.body.useBy),
        foodImage: '',
        createdAt: new Date()
      };
      const docRef = await db.collection('donations').add(donation);
      donation.id = docRef.id;
      return res.json({ success: true, donation });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const order = { ...req.body, status: 'placed', orderDate: new Date() };
    const docRef = await db.collection('orders').add(order);
    order.id = docRef.id;
    res.json({ success: true, orderId: order.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActiveDonations = async (req, res) => {
  try {
    const donationsRef = db.collection('donations');
    const snapshot = await donationsRef.where('useBy', '>', new Date()).get();
    let active = [];
    snapshot.forEach(doc => {
      let donation = doc.data();
      donation.id = doc.id;
      active.push(donation);
    });
    res.json({ donations: active });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
