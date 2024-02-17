export function formatRemainingTime(expireDate: number) {
  const currentDate = new Date().getTime();
  const remainingMilliseconds = expireDate - currentDate;

  const seconds = Math.floor((remainingMilliseconds / 1000) % 60);
  const minutes = Math.floor((remainingMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((remainingMilliseconds / (1000 * 60 * 60)) % 24);

  return {
    hours,
    minutes,
    seconds,
  };
}

export function unixTimestampToMinutes(expireDate: number) {
  return expireDate / 60;
}
