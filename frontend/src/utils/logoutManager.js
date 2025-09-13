let externalLogout = null;

export function setExternalLogout(fn) {
  externalLogout = fn;
}

export function getLogout() {
  return externalLogout;
}
