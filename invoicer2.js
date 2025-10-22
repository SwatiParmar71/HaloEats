const send_schedule = {
  "-10": "Upcoming",
  "0": "New",
  "20": "Reminder",
  "30": "Due",
};

const priorityMap = {
  "Due": 1,
  "Reminder": 2,
  "New": 3,
  "Upcoming": 4,
};

function sendEmails(customerInvoices, customerPayments) {
  const sortedOffsets = Object.keys(send_schedule)
    .map(Number)
    .sort((a, b) => a - b);

  // Group and sort payments by customer
  const paymentsByCustomer = {};
  for (const payment of customerPayments) {
    if (!(payment.name in paymentsByCustomer)) paymentsByCustomer[payment.name] = [];
    paymentsByCustomer[payment.name].push(payment);
  }
  for (const name in paymentsByCustomer) {
    paymentsByCustomer[name].sort((a, b) => a.payment_time - b.payment_time);
  }

  // Invoice amount lookup by customer
  const invoiceAmountByCustomer = {};
  for (const invoice of customerInvoices) {
    invoiceAmountByCustomer[invoice.name] = invoice.amount;
  }

  // Calculate owed amount at a given time for a customer
  function amountOwedAtTime(name, time) {
    const payments = paymentsByCustomer[name] || [];
    let paid = 0;
    for (const p of payments) {
      if (p.payment_time <= time) paid += p.amount;
    }
    const owed = invoiceAmountByCustomer[name] - paid;
    return owed > 0 ? owed : 0;
  }

  let allEmails = [];
  for (const invoice of customerInvoices) {
    for (const offset of sortedOffsets) {
      const sendTime = invoice.invoice_time + offset;
      const owed = amountOwedAtTime(invoice.name, sendTime);
      if (owed === 0) continue; // skip fully paid
      allEmails.push({
        time: sendTime,
        type: send_schedule[offset],
        name: invoice.name,
        amount: owed,
      });
    }
  }

  // Sort by time and then priority
  allEmails.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return priorityMap[a.type] - priorityMap[b.type];
  });

  for (const email of allEmails) {
    console.log(
      `${email.time}: [${email.type}] Invoice for ${email.name} for ${email.amount} dollars`
    );
  }

  // Delinquent customers after due date
  const delinquent = {};
  const maxOffset = sortedOffsets[sortedOffsets.length - 1];
  for (const invoice of customerInvoices) {
    const dueTime = invoice.invoice_time + maxOffset;
    const owedAfterDue = amountOwedAtTime(invoice.name, dueTime);
    if (owedAfterDue > 0) delinquent[invoice.name] = owedAfterDue;
  }

  if (Object.keys(delinquent).length) {
    console.log("Delinquent customers:");
    for (const name in delinquent) {
      console.log(`${name} owes ${delinquent[name]} dollars`);
    }
  }
}

// Example usage
const customer_invoices_2 = [
  { invoice_time: 0, name: "Alice", amount: 200 },
  { invoice_time: 1, name: "Bob", amount: 100 },
];
const customer_payments_2 = [
  { payment_time: -9, name: "Alice", amount: 100 },
  { payment_time: 1, name: "Alice", amount: 50 },
  { payment_time: 0, name: "Bob", amount: 100 },
];

console.log("Part 2 output:");
sendEmails(customer_invoices_2, customer_payments_2);
