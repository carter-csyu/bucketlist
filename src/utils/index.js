export function emailRe(email) {
  const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (re.exec(email) === null) {
    return false;
  } else {
    return true;
  }
}

export function getDate(dateStr) {
  const datetime = new Date(dateStr);

  const yyyy = datetime.getFullYear();
  const mm = datetime.getMonth() + 1;
  const dd = datetime.getDate();
  const hh24 = datetime.getHours();
  const mi = datetime.getMinutes();
  const ss = datetime.getSeconds();

  return `${yyyy}/${mm}/${dd} ${hh24}:${mi}:${ss}`;
}