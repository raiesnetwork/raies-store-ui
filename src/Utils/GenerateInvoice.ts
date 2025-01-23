import jsPDF from "jspdf";
import "jspdf-autotable";
import { State, Country } from "country-state-city";

export const generateInvoicePDF = (invoiceData: any) => {
  const doc = new jsPDF("p", "pt");

  // Company Info (Right aligned)
  doc.setFontSize(10);
  doc.text("RAIS NETWORK", 450, 40);
  doc.text("012, Bollineni Hillside,", 450, 55);
  doc.text("perumbakkam- 600126", 450, 70);
  doc.text("Chennai, India", 450, 85);
  doc.text("contact@raisnetwork.com", 450, 100);

  // Main Title
  doc.setFontSize(35);
  doc.text("Invoice", 40, 50);

  // Bill To Section
  doc.setFontSize(12);
  doc.text("Billed To:", 40, 120);
  doc.text(invoiceData?.subscription?.UserDetails?.profile?.name, 40, 140);
  doc.text(invoiceData?.subscription?.UserDetails?.mobile, 40, 155);
  doc.text(invoiceData?.subscription?.city, 40, 170);
  doc.text(invoiceData?.subscription?.pin.toString(), 40, 185);
  doc.text(
    State.getStateByCodeAndCountry(
      invoiceData?.subscription?.state,
      invoiceData?.subscription?.region
    )?.name || "" + ",",
    40,
    200
  );
  doc.text(Country.getCountryByCode(invoiceData?.subscription?.region)?.name ||"",
  40,215
)

  // Invoice Details (Right aligned)
  doc.text(
    `Date Issued: ${new Date(invoiceData?.createdAt).toLocaleDateString(
      "en-GB",
      { day: "2-digit", month: "short", year: "numeric" }
    )}`,
    450,
    140
  );
  doc.text(
    `Invoice Number: ${invoiceData?.invoiceNumber || "INV-10012"}`,
    450,
    160
  );
  doc.text(
    `Amount Due: $${invoiceData?.amount.toFixed(2) || "0.00"}`,
    450,
    180
  );
  doc.text(
    `Due Date: ${new Date(invoiceData?.dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`,
    450,
    200
  );

  // Line Items (Description, Quantity, Rate, Amount)
  const tableColumn = ["DESCRIPTION", "AMOUNT"];
  const tableRows: any = [];
  tableRows.push([`${invoiceData?.subscription?.storeName} Store Subscription Plan`, invoiceData?.amount || 0]);

  const payment = invoiceData?.subscription?.UserDetails?.onlinePayments[0];
  tableRows.push([
    "Transaction ID",
    payment.transactionDetails.razorpay_payment_id || "N/A",
  ]);

  // Render line items table
  // @ts-ignore
  doc.autoTable({
    startY: 240,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 0, 0] }, // Black header
  });

  // Subtotal, Discount, Tax, Total
  // @ts-ignore

  const subtotalY = doc.lastAutoTable.finalY + 20;
  doc.text("Tax", 400, subtotalY);
  doc.text("$80.93", 500, subtotalY);
  doc.setFontSize(14);
  doc.text("Total", 400, subtotalY + 20);
  doc.text(payment?.amount.toString(), 500, subtotalY + 20);

  // Footer with Status
  const statusY = subtotalY + 120;
  doc.text(`Status: ${invoiceData?.status || "Unpaid"}`, 40, statusY);

  // Save PDF
  doc.save(`invoice_${invoiceData?.invoiceNumber}.pdf`);
};
