const Donation = require('../models/Donation');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Add Donation (handles image upload via multer)
exports.addDonation = async (req, res) => {
    try {
        const { distributor, foodType, allergy, quantity, location, pickupTime, useBy } = req.body;

         // Basic Validation
         if (!distributor || !foodType || !allergy || !quantity || !location || !pickupTime || !useBy || !req.file) {
             return res.status(400).json({ success: false, message: 'Missing required fields or image.' });
         }
         const useByDate = new Date(useBy);
         if (isNaN(useByDate) || useByDate <= new Date()) {
             return res.status(400).json({ success: false, message: 'Use-By date must be a valid future date.' });
         }
          if (parseInt(quantity) <= 0) {
             return res.status(400).json({ success: false, message: 'Quantity must be greater than zero.' });
         }


        let foodImageUrl = '';
        if (req.file) {
            // Save file path relative to the server root accessible via URL
            // Multer saves to 'Web/uploads', so the URL path should be '/uploads/'
            foodImageUrl = `/uploads/${req.file.filename}`;
            console.log("Image saved at:", foodImageUrl);
        } else {
             // Handle case where file is required but missing (though validated above)
             return res.status(400).json({ success: false, message: 'Food image is required.' });
        }

        const donation = new Donation({
            distributor, // Should be the distributor's User ID
            foodType,
            allergy,
            quantity: parseInt(quantity),
            location,
            pickupTime,
            useBy: useByDate,
            foodImage: foodImageUrl, // Store the URL path
            createdAt: new Date(),
        });

        const savedDonation = await donation.save();
        res.status(201).json({ success: true, donation: savedDonation });

    } catch (err) {
        console.error("Add Donation Error:", err);
         // If validation fails (e.g., wrong type for quantity)
         if (err.name === 'ValidationError') {
             return res.status(400).json({ success: false, message: `Validation Error: ${err.message}` });
         }
        res.status(500).json({ success: false, message: 'Server error adding donation.' });
    }
};

// Get details for a single donation by its ID
exports.getDonation = async (req, res) => {
    try {
        const donationId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(donationId)) {
            return res.status(400).json({ success: false, message: 'Invalid Donation ID format.' });
        }

        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }
         // Optional: Populate distributor details if needed
         // await donation.populate('distributor', 'name contact'); // Example

        res.json({ success: true, donation });

    } catch (err) {
        console.error("Get Donation Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching donation.' });
    }
};

// Place an order and decrement donation quantity
exports.placeOrder = async (req, res) => {
    // Use a session for atomicity if possible (more advanced)
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const { donationId, itemCount, collector } = req.body;
        const quantityRequested = parseInt(itemCount);

         // Validation
         if (!mongoose.Types.ObjectId.isValid(donationId) || !mongoose.Types.ObjectId.isValid(collector)) {
             return res.status(400).json({ success: false, message: 'Invalid ID format.' });
         }
         if (isNaN(quantityRequested) || quantityRequested <= 0) {
             return res.status(400).json({ success: false, message: 'Invalid item count requested.' });
         }


        // Find the donation and lock it for update if using sessions
        // const donation = await Donation.findById(donationId).session(session);
         const donation = await Donation.findById(donationId);

        if (!donation) {
             // await session.abortTransaction(); session.endSession();
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }

        // Check if donation is expired
        if (donation.useBy <= new Date()) {
             // await session.abortTransaction(); session.endSession();
            return res.status(400).json({ success: false, message: 'This donation has expired.' });
        }

        // Check if there are enough servings available
        if (donation.quantity < quantityRequested) {
             // await session.abortTransaction(); session.endSession();
            return res.status(400).json({ success: false, message: `Not enough servings available. Only ${donation.quantity} left.` });
        }

        // Create the order
        const order = new Order({
            donationId,
            collector, // Collector's User ID
            distributor: donation.distributor, // Distributor's User ID from the donation
            itemCount: quantityRequested,
            status: 'placed', // Initial status
            orderDate: new Date(),
        });

        // const savedOrder = await order.save({ session });
         const savedOrder = await order.save();

        // Decrement the donation quantity atomically
        // Use findByIdAndUpdate for atomic operation
         const updatedDonation = await Donation.findByIdAndUpdate(
             donationId,
             { $inc: { quantity: -quantityRequested } }, // Atomically decrease quantity
             { new: true } // Return the updated document
             // { session }
         );


         if (!updatedDonation) {
             // This case should ideally not happen if the findById worked, but handle defensively
             // await session.abortTransaction(); session.endSession();
             // Attempt to rollback the order creation (delete the order) - complex without transactions
             await Order.findByIdAndDelete(savedOrder._id);
             console.error(`Failed to update donation quantity for ID: ${donationId} after order ${savedOrder._id}`);
             return res.status(500).json({ success: false, message: 'Failed to update donation quantity.' });
         }


        // If using sessions:
        // await session.commitTransaction();
        // session.endSession();

        res.status(201).json({
             success: true,
             message: 'Order placed successfully.',
             orderId: savedOrder._id,
             updatedDonation: { // Send back only essential updated info
                 _id: updatedDonation._id,
                 quantity: updatedDonation.quantity
             }
         });

    } catch (err) {
        // If using sessions:
        // await session.abortTransaction();
        // session.endSession();
        console.error("Place Order Error:", err);
        res.status(500).json({ success: false, message: 'Server error placing order.' });
    }
};

// Get all active donations (useBy date in future AND quantity > 0)
exports.getActiveDonations = async (req, res) => {
    try {
        const activeDonations = await Donation.find({
            useBy: { $gt: new Date() },
             quantity: { $gt: 0 } // Only show donations with items left
        }).sort({ createdAt: -1 }); // Sort by newest first

        res.json({ success: true, donations: activeDonations });

    } catch (err) {
        console.error("Get Active Donations Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching active donations.' });
    }
};


// Update Donation (Placeholder - Requires more specific logic for what can be updated)
exports.updateDonation = async (req, res) => {
     try {
         const donationId = req.params.id;
         const updates = req.body; // Get updates from request body
          // TODO: Add validation for updates
          // TODO: Decide which fields are updatable (e.g., quantity, pickupTime, maybe allergy info)
          // Be cautious about allowing changes to core details like foodType or location after listing.

         // Prevent changing the distributor or creation date, etc.
         delete updates.distributor;
         delete updates.createdAt;
         delete updates.foodImage; // Handle image update separately if needed

         if (!mongoose.Types.ObjectId.isValid(donationId)) {
             return res.status(400).json({ success: false, message: 'Invalid Donation ID format.' });
         }

         const updatedDonation = await Donation.findByIdAndUpdate(donationId, updates, { new: true, runValidators: true });

         if (!updatedDonation) {
             return res.status(404).json({ success: false, message: 'Donation not found or could not be updated.' });
         }

         res.json({ success: true, message: 'Donation updated successfully.', donation: updatedDonation });

     } catch (err) {
         console.error("Update Donation Error:", err);
          if (err.name === 'ValidationError') {
              return res.status(400).json({ success: false, message: `Validation Error: ${err.message}` });
          }
         res.status(500).json({ success: false, message: 'Server error updating donation.' });
     }
 };

// Delete Donation (Implement with caution - maybe mark as inactive instead?)
 exports.deleteDonation = async (req, res) => {
     try {
         const donationId = req.params.id;
         if (!mongoose.Types.ObjectId.isValid(donationId)) {
              return res.status(400).json({ success: false, message: 'Invalid Donation ID format.' });
          }
           // Optional: Check if the user requesting deletion is the owner (distributor)

          const deletedDonation = await Donation.findByIdAndDelete(donationId);

          if (!deletedDonation) {
              return res.status(404).json({ success: false, message: 'Donation not found.' });
          }

           // Optional: Delete associated image file from '/uploads' folder using fs.unlink

          res.json({ success: true, message: 'Donation deleted successfully.' });

      } catch (err) {
          console.error("Delete Donation Error:", err);
          res.status(500).json({ success: false, message: 'Server error deleting donation.' });
      }
  };