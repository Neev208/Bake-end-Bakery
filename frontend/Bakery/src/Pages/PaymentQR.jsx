import React, { useState } from 'react';
import { QRCodeSVG } from 'react-qr-code';

const PaymentQR = () => {
  const [amount, setAmount] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Replace this with your actual UPI ID or Payment Gateway Link
  const bakeryUPI = "yourname@bank"; 
  const bakeryName = "Sweet Delights Bakery";

  // This formats the string for a UPI payment (Common in India)
  // If using another service, replace this URL structure
  const paymentValue = `upi://pay?pa=${bakeryUPI}&pn=${bakeryName}&am=${amount}&cu=INR`;

  const handleGenerate = (e) => {
    e.preventDefault();
    if (amount > 0) {
      setShowQR(true);
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bakery Checkout</h2>
        <p style={styles.subtitle}>Enter the total to generate your payment QR</p>

        <form onSubmit={handleGenerate} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setShowQR(false); // Hide QR when amount changes to force refresh
              }}
              placeholder="0.00"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Generate QR Code
          </button>
        </form>

        {showQR && (
          <div style={styles.qrContainer}>
            <div style={styles.qrWrapper}>
              <QRCodeSVG 
                value={paymentValue} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#5d4037"} // Bakery Brown
                level={"H"}
              />
            </div>
            <p style={styles.amountText}>Pay: ₹{amount}</p>
            <p style={styles.footerNote}>Scan with GPay, PhonePe, or Paytm</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple inline styles for the "Bakery" look
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#fff9f0', // Cream
    padding: '20px',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'serif',
    color: '#5d4037',
    marginBottom: '5px',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '25px',
  },
  inputGroup: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#5d4037',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #eee',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff85a2', // Bakery Pink
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  qrContainer: {
    marginTop: '30px',
    animation: 'fadeIn 0.5s ease-in',
  },
  qrWrapper: {
    padding: '15px',
    border: '2px dashed #ff85a2',
    display: 'inline-block',
    borderRadius: '12px',
  },
  amountText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ff85a2',
    marginTop: '10px',
  },
  footerNote: {
    fontSize: '12px',
    color: '#aaa',
    marginTop: '5px',
  }
};

export default PaymentQR;