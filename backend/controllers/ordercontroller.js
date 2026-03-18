const nodemailer = require('nodemailer');

// 1. Configure the email sender
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email provider
  auth: {
    user: 'your-bakery-email@gmail.com',
    pass: 'your-app-password' // Use a Google App Password, not your regular password
  }
});

const placeOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, _id } = req.body;
    // ... your logic to save order to database ...

    // 2. Define the Email Content
    const mailOptions = {
      from: '"Bake-End Bakery" <your-bakery-email@gmail.com>',
      to: customer.email,
      subject: `Order Confirmed! Ref: #${req.body.orderId || 'New Order'}`,
      html: `
        <div style="font-family: serif; color: #4A3728; max-width: 600px; margin: auto; border: 1px solid #C2A382; padding: 20px; border-radius: 20px;">
          <h1 style="text-align: center; color: #4A3728;">Thank You, ${customer.name}!</h1>
          <p style="text-align: center;">Your delights are being prepared with love.</p>
          <hr style="border: 0; border-top: 1px solid #C2A382; opacity: 0.3;">
          <h3>Order Summary:</h3>
          <ul>
            ${items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
          </ul>
          <p><strong>Total Amount: ₹${totalAmount}</strong></p>
          <p>Delivery to: ${customer.address}, ${customer.pincode}</p>
          <footer style="margin-top: 20px; text-align: center; font-size: 10px; color: #C2A382;">
            THANK YOU FOR CHOOSING BAKE-END BAKERY
          </footer>
        </div>
      `
    };

    // 3. Send the Email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Order placed and email sent!" });
  } catch (error) {
    console.error("Email Error:", error);
    // Even if email fails, we usually still return success for the order
    res.status(201).json({ success: true, warning: "Order placed, but email failed." });
  }
};