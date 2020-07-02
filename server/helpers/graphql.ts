import { appUrls } from 'server/utils/appUrls';
import { toWithError } from './async';

const fetchQuery = (query: string) =>
  fetch(appUrls.tbase, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

export const makeQuery = async (query: string) => {
  const [response, fetchError] = await toWithError(fetchQuery(query));

  if (fetchError) return [undefined, fetchError];

  const result = await response.json();

  const { errors, data } = result || {};

  return [data, errors];
};
