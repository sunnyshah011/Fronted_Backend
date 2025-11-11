import PaymentMethod from "../models/PaymentMethods.model.js";

// ✅ Fetch all payment methods
export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.json({ success: true, methods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add a new payment method
export const addPaymentMethod = async (req, res) => {
  try {
    const { name, title, accountNumber } = req.body;
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });

    const newMethod = new PaymentMethod({
      name,
      title,
      accountNumber,
      image: req.file.path, // multer stores the path
    });

    await newMethod.save();
    res.json({ success: true, method: newMethod });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update a payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, accountNumber } = req.body;

    const updateData = { name, title, accountNumber };
    if (req.file) updateData.image = req.file.path;

    const updatedMethod = await PaymentMethod.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedMethod)
      return res
        .status(404)
        .json({ success: false, message: "Method not found" });

    res.json({ success: true, method: updatedMethod });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete a payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentMethod.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Method not found" });

    res.json({ success: true, message: "Payment method deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
