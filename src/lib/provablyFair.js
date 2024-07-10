import { sha256 } from 'js-sha256';

export const generateServerSeed = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const hashServerSeed = (serverSeed) => {
  return sha256(serverSeed);
};

export const generateDiceRoll = (serverSeed, clientSeed) => {
  const combinedSeed = serverSeed + clientSeed;
  const hash = sha256(combinedSeed);
  const decimal = parseInt(hash.substr(0, 8), 16);
  return (decimal % 6) + 1;
};