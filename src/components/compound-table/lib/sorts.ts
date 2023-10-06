function getDigit(user: any, index: number) {
  return Math.floor(Math.abs(user.id) / 10 ** index) % 10;
}

function digitCount(user: any) {
  if (user.id === 0) return 1;
  return Math.floor(Math.log10(Math.abs(user.id))) + 1;
}

function mostDigits(users: any[]) {
  let maxDigits = 0;
  for (let index = 0; index < users.length; index += 1) {
    maxDigits = Math.max(maxDigits, digitCount(users[index]));
  }
  return maxDigits;
}

export function sort(users: any[]) {
  const maxIdDigitCount = mostDigits(users);
  const newUsers: any[] = [];
  for (let k = 0; k < maxIdDigitCount; k += 1) {
    const useresBuckets: any[][] = Array.from({ length: 10 }, () => []);
    for (let index = 0; index < users.length; index += 1) {
      const digit = getDigit(users[index], k);
      useresBuckets[digit].push(users[index]);
    }
    users = newUsers.concat(...useresBuckets);
  }
  return users;
}
