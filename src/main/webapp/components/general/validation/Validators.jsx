'use strict';

export const notEmpty = (errorText = 'Bitte hier etwas eingeben') => value => ({
  valid: value !== null && value !== undefined && value !== '',
  error: errorText
});

/*
 * A function that returns a validator
 */
export const minLength = min => value => ({
  valid: notEmpty()(value).valid && value.length >= min,
  error: 'Mindestens ' + min + ' Zeichen eingeben'
});

export const email = (errorText = 'Bitte eine gültige E-Mail-Adresse angeben') => value => ({
  valid: notEmpty()(value).valid && value.match("^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@"
    + "[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$"),
  error: errorText
});

export const telephone = (errorText = 'Bitte eine gültige Telefonnummer angeben') => value => ({
  valid: notEmpty()(value).valid && value.match("^[+]?[0-9/ -]+$"),
  error: errorText
});

export const matches = (expectedValue, errorText = 'Die angegebenen Werte stimmen nicht überein') => value => ({
  valid: expectedValue === value,
  error: errorText
});

export const cheked = (errorText = 'Bitte bestätigen') => value => ({
  valid: !!value,
  error: errorText
});