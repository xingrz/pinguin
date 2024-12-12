export const NODE_ID = process.env.NODE_ID!;
if (!NODE_ID) {
  throw new Error('$NODE_ID is required');
}

export const API_SERVER = process.env.API_SERVER!;
if (!API_SERVER) {
  throw new Error('$API_SERVER is required');
}

export const DEFAULT_INTERVAL = '1m';
export const DEFAULT_COUNT = 5;
