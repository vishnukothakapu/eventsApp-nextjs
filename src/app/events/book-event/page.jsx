// "use client";
// import { useState, useEffect } from "react";
// import Script from "next/script";

// const PaymentPage = () => {
//     const AMOUNT = 100;
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handlePayment = async () => {
//         setIsProcessing(true);
//         try {
//             // Step 1: Create an order on your server
//             const response = await fetch(`/api/book-event`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ amount: AMOUNT * 100 }), // Amount in paise
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to create order");
//             }

//             const data = await response.json(); // Await the JSON response
//             if (!data.order_id) {
//                 throw new Error("Order ID not found in response");
//             }

//             // Step 2: Initialize Razorpay
//             const options = {
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is set in your .env file
//                 amount: AMOUNT * 100, // Amount in paise
//                 currency: "INR",
//                 name: "EventsApp",
//                 description: "Events App Organization",
//                 order_id: data.order_id, // Use the order ID from the server
//                 handler: function (response) {
//                     console.log("Payment successful", response);
//                     alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
//                     router.push("/my-bookings");
//                 },
//                 prefill: {
//                     name: "Test User",
//                     email: "test@test.com",
//                     contact: "1234567890",
//                 },
//                 theme: {
//                     color: "#3399cc",
//                 },
//             };

//             const rzp1 = new window.Razorpay(options);
//             rzp1.open();

//             // Step 3: Handle payment failure
//             rzp1.on("payment.failed", function (response) {
//                 console.error("Payment failed", response);
//                 alert("Payment failed. Please try again.");
//             });
//         } catch (err) {
//             console.error("Payment error:", err);
//             alert("An error occurred. Please try again.");
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center h-[100vh] light:bg-gray-100">
//             {/* Load Razorpay script */}
//             <Script
//                 src="https://checkout.razorpay.com/v1/checkout.js"
//                 strategy="beforeInteractive" // Ensure the script loads before the component is interactive
//             />

//             <div className="p-6 bg-white dark:bg-[#161c27] rounded-lg shadow-md">
//                 <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
//                 <p className="text-xl mb-4">Amount to pay: ₹{AMOUNT}</p>
//                 <button
//                     onClick={handlePayment}
//                     disabled={isProcessing}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
//                 >
//                     {isProcessing ? "Processing..." : "Pay Now"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PaymentPage;
import React from 'react'

const page = () => {
    return (
        <div className='text-center flex justify-center items-center h-[100vh]'>404 NOT FOUND</div>
  )
}

export default page