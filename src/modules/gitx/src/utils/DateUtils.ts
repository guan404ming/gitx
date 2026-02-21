const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getDayOfWeekLabel(index: number): string {
  return DAY_NAMES[index] ?? '';
}

export function getMonthLabel(monthIndex: number): string {
  return MONTH_NAMES[monthIndex] ?? '';
}

export function getMonthFromDateStr(dateStr: string): number {
  return new Date(dateStr).getMonth();
}

export function calculateStreak(
  days: Array<{ date: string; count: number }>
): { current: number; longest: number } {
  const sorted = [...days].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let current = 0;
  let longest = 0;
  let streak = 0;
  let expectDate: Date | null = null;

  for (const day of sorted) {
    const d = new Date(day.date);

    if (expectDate !== null) {
      const diff = expectDate.getTime() - d.getTime();
      const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));

      if (diffDays !== 1) {
        if (streak > longest) longest = streak;
        if (current === 0 && day.count > 0) {
          // Gap before any contribution, reset
        }
        streak = 0;
      }
    }

    if (day.count > 0) {
      streak++;
      if (current === 0) current = streak;
    } else {
      if (streak > longest) longest = streak;
      streak = 0;
    }

    expectDate = d;
  }

  if (streak > longest) longest = streak;

  return { current, longest };
}

export function getMostActiveDay(
  days: Array<{ date: string; count: number }>
): string {
  const totals = [0, 0, 0, 0, 0, 0, 0];
  for (const day of days) {
    const dow = new Date(day.date).getDay();
    totals[dow] += day.count;
  }
  let maxIdx = 0;
  for (let i = 1; i < 7; i++) {
    if (totals[i] > totals[maxIdx]) maxIdx = i;
  }
  return DAY_NAMES[maxIdx];
}

export function shortSha(sha: string): string {
  return sha.substring(0, 7);
}
