export const environment = {
  apiUrl: typeof process !== 'undefined' && process.env?.['API_URL']
    ? process.env['API_URL']
    : 'https://recruitment.africremit.ca/api',
};
