// --- Email priorities (lower = higher priority) ---
const priorityMap = {
  "Expiration": 1,
  "Upcoming Expiration": 2,
  "Welcome": 3
};

// --- Function to send subscription emails ---
function sendEmails(users, planChanges, planDurations) {
  const allEmails = [];

  for (const user of users) {
    const { name } = user;
    let currentPlan = user.plan;
    let beginDate = user.begin_date;
    let duration = planDurations[currentPlan];

    // Check if this user has a plan change
    const change = planChanges.find(c => c.name === name);

    // --- Step 1: Handle original plan (before change) ---
    let endDate = change ? Math.min(beginDate + duration, change.change_date) : beginDate + duration;

    // Welcome email
    allEmails.push({ time: beginDate, type: "Welcome", name, plan: currentPlan });

    // Upcoming Expiration email (only if it happens before change)
    if (endDate - 15 > beginDate) {
      allEmails.push({ time: endDate - 15, type: "Upcoming Expiration", name, plan: currentPlan });
    }

    // Expiration email (cut off at change date if any)
    allEmails.push({ time: endDate, type: "Expiration", name, plan: currentPlan });

    // --- Step 2: Handle new plan if change exists ---
    if (change) {
      const { new_plan, change_date } = change;
      currentPlan = new_plan;
      beginDate = change_date;
      duration = planDurations[currentPlan];
      endDate = beginDate + duration;

      allEmails.push({ time: beginDate, type: "Welcome", name, plan: currentPlan });
      allEmails.push({ time: endDate - 15, type: "Upcoming Expiration", name, plan: currentPlan });
      allEmails.push({ time: endDate, type: "Expiration", name, plan: currentPlan });
    }
  }

  // --- Step 3: Sort emails by time, then priority ---
  allEmails.sort((a, b) =>
    a.time === b.time
      ? priorityMap[a.type] - priorityMap[b.type]
      : a.time - b.time
  );

  // --- Step 4: Print emails ---
  console.log("Subscription Email Schedule:");
  for (const { time, type, name, plan } of allEmails) {
    console.log(`${time}: [${type}] Email for ${name} (Plan: ${plan})`);
  }
}

// --- Example Data ---
const users = [
  { name: "Alice", plan: "Basic", begin_date: 0 },
  { name: "Bob", plan: "Pro", begin_date: 5 },
  { name: "Swati", plan: "Premium", begin_date: 10 }
];

const planChanges = [
  { name: "Alice", new_plan: "Diamond", change_date: 20 },
  { name: "Swati", new_plan: "Gold", change_date: 50 }
];

const planDurations = {
  "Basic": 30,
  "Pro": 20,
  "Premium": 60,
  "Gold": 60,
  "Diamond": 45
};

// --- Run the simulation ---
sendEmails(users, planChanges, planDurations);
