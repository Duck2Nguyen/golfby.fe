export const getKey = <T>(key: string): T | null => {
  try {
    let value = null;
    if (window.localStorage != null) {
      value = window.localStorage.getItem(key);
    }
    if (value == null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.log('Error getKey', error);
    return null;
  }
};

export const getSessionKey = <T>(key: string): T | null => {
  try {
    let value = null;
    if (window.sessionStorage != null) {
      value = window.sessionStorage.getItem(key);
    }
    if (value == null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.log('Error getSessionKey', error);
    return null;
  }
};

export const setKey = <T>(key: string, value: T): void => {
  try {
    if (value != null) {
      if (window.localStorage != null) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    }
  } catch (error) {
    console.log('Error setKey', error);
    return;
  }
};

export const setSessionKey = <T>(key: string, value: T): void => {
  try {
    if (value != null) {
      if (window.sessionStorage != null) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    }
  } catch (error) {
    console.log('Error setSessionKey', error);
    return;
  }
};

export const removeKey = (key: string): void => {
  try {
    if (window.localStorage != null) {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.log('Error removeKey', error);
    return;
  }
};

export const removeSessionKey = (key: string): void => {
  try {
    if (window.sessionStorage != null) {
      window.sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.log('Error removeSessionKey', error);
    return;
  }
};
