export const groupExpensesByWeek = (transactions) => {
  const weeks = {};

  transactions.forEach((tx) => {
   const isEmail = typeof tx.subject === 'string';
const subject = isEmail ? tx.subject.toLowerCase() : '';
const type = isEmail ? (subject.includes("debited") ? "debited" : "credited") : tx.type;

    if (type !== "debited") return;

    const amount = isEmail
      ? parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0])
      : parseFloat(tx.amount);

    const date = new Date(tx.date);
    if (isNaN(amount) || isNaN(date)) return;

    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const key = start.toISOString();
    const label = `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}–${end.getDate()}`;

    if (!weeks[key]) weeks[key] = { name: label, amount: 0 };
    weeks[key].amount += amount;
  });

  const now = new Date();
  const current = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  current.setHours(0, 0, 0, 0);

  const finalData = [];
  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(current);
    weekStart.setDate(current.getDate() - i * 7);

    const key = weekStart.toISOString();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const label = `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()}–${weekEnd.getDate()}`;
    finalData.push(weeks[key] || { name: label, amount: 0 });
  }

  return finalData;
};


export const groupExpensesByMonth = (transactions) => {
  const months = {};

  transactions.forEach((tx) => {
    const isEmail = !!tx.subject;
    const subject = isEmail ? tx.subject.toLowerCase() : '';
    const type = isEmail ? (subject.includes("debited") ? "debited" : "credited") : tx.type;
    if (type !== "debited") return;

    const amount = isEmail
      ? parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0])
      : parseFloat(tx.amount);

    const date = new Date(tx.date);
    if (isNaN(amount) || isNaN(date)) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    if (!months[key]) months[key] = { name: label, amount: 0 };
    months[key].amount += amount;
  });

  const now = new Date();
  const finalData = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
    finalData.push(months[key] || { name: label, amount: 0 });
  }

  return finalData;
};
