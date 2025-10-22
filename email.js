
// Lower number = higher priority
const priorityMap = {
  "Expiration": 1,
  "Upcoming Expiration": 2,
  "Welcome": 3,
};

function sendEmails(subscriptions) {
  const allEmails = [];

  for (const sub of subscriptions) {
    const { name, plan, begin_date, duration } = sub;

    // Calculate actual email dates
    const schedule = [
      { time: begin_date, type: "Welcome" },
      { time: begin_date + duration - 15, type: "Upcoming Expiration" },
      { time: begin_date + duration, type: "Expiration" },
    ];

    for (const s of schedule) {
      allEmails.push({
        time: s.time,
        type: s.type,
        name: sub.name,
        plan: sub.plan,
      });
    }
  }

  // Sort emails by date, then by priority
  allEmails.sort((a, b) =>
    a.time === b.time
      ? priorityMap[a.type] - priorityMap[b.type]
      : a.time - b.time
  );

  // Print emails
  console.log("Subscription Email Schedule:");
  for (const { time, type, name, plan } of allEmails) {
    console.log(`${time}: [${type}] Email for ${name} (Plan: ${plan})`);
  }
}

// Example usage
const users = [
  { name: "Akky", plan: "Gold", begin_date: 0, duration: 30 },
  { name: "Bob", plan: "Silver", begin_date: 5, duration: 45 },
  { name: "Swati", plan: "Platinum", begin_date: 10, duration: 60 },
];

sendEmails(users);
