import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
const formatDate = (dateString) => {
    const options = { weekday: "long", day: "2-digit", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
};
const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};
export const generatePDF = async (booking) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("EVENTS.", 105, 20, { align: "center" });

    // Generate QR Code
    const qrData = `Booking ID: ${booking._id}`;
    const qrImageData = await QRCode.toDataURL(qrData);
    doc.addImage(qrImageData, "PNG", 150, 30, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking Id: ${booking.orderId}`,20,30);
    doc.text(`Event Name: ${booking.event?.title || "N/A"}`, 20, 40);
    doc.text(`Date & Time: ${formatDate(booking.event?.date)} at ${formatTime(booking.event?.time) || "N/A"}`, 20, 50);
    doc.text(`Mode: ${booking.event?.isOnline ? "Online" : "Offline"}`, 20, 60);
    if (booking.event?.isOnline && booking.event?.onlineLink) {
        doc.setTextColor(0,0,0);
        doc.text(`Event Link:`,20,70);
        doc.setTextColor(79, 70, 229);
        doc.textWithLink(booking.event?.onlineLink, 45, 70, { url: booking.event?.onlineLink });
        doc.setTextColor(0,0,0);
    } else {
        doc.text(`Location: ${booking.event?.location || "N/A"}`, 20, 70);
    }
    doc.text(`Price: ${booking.price}`, 20, 80);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(12);
    doc.text("Payment Details", 20, 100);

    autoTable(doc,{
        startY: 110,
        head: [["Field", "Value"]],
        body: [
            ["Price", `${booking.price}`],
            ["Paid on", formatDate(booking.bookedAt)],
            ["Payment Mode", booking.paymentMethod.toUpperCase()],
            ["Payment ID", booking.paymentId],
            ["Bank Name", booking.paymentBank],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [76, 81, 191] },
    });


    doc.save(`EVENTS_${booking.event._id}.pdf`);
};