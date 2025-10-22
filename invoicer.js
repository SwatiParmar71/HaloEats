const send_schedule = {
  "-10": "Upcoming",
  "0": "New",
  "20": "Reminder",
  "30": "Due",
};

// Priority map for email types: lower number means higher priority
const priorityMap = {
  "Due": 1,
  "Reminder": 2,
  "New": 3,
  "Upcoming": 4,
};

function sendEmails(customerInvoices) {
  const sortedOffsets = Object.keys(send_schedule)
    .map(Number)
    .sort((a, b) => a - b);

  let allEmails = [];

  for (const invoice of customerInvoices) {
    for (const offset of sortedOffsets) {
      const sendTime = invoice.invoice_time + offset;
      allEmails.push({
        time: sendTime,
        type: send_schedule[offset],
        name: invoice.name,
        amount: invoice.amount,
      });
    }
  }

  allEmails.sort((a, b) => {
    if (a.time !== b.time) {
      return a.time - b.time; // Sort by time ascending
    }
    // For same send time, sort by priority of email type
    return priorityMap[a.type] - priorityMap[b.type];
  });

  for (const email of allEmails) {
    console.log(
      `${email.time}: [${email.type}] Invoice for ${email.name} for ${email.amount} dollars`
    );
  }
}

// Example usage
const customer_invoices = [
  { invoice_time: 0, name: "Alice", amount: 200 },
  { invoice_time: 1, name: "Bob", amount: 100 },
  { invoice_time: 10, name: "Swati", amount: 500 },
  { invoice_time: 5, name: "Akky", amount: 1000 },
];

console.log("Invoice reminder emails:");
sendEmails(customer_invoices);
