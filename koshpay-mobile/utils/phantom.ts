import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Linking } from 'react-native';

// Polyfill global Buffer
global.Buffer = global.Buffer || Buffer;

const PHANTOM_BASE = 'https://phantom.app/ul/v1';

export interface PhantomSession {
  appPublicKey: string; // My app's public key
  appSecretKey: Uint8Array; // My app's secret key
  sharedSecret?: Uint8Array; // Derived shared secret
  phantomPublicKey?: string; // Phantom's Encryption Key (for shared secret)
  walletPublicKey?: string;  // Phantom's Wallet Address (for transactions)
  session?: string; // Session string from Phantom
}

// Simple in-memory storage for the session (resets on app reload)
let storedPhantomSession: PhantomSession | null = null;

export const getStoredPhantomSession = () => storedPhantomSession;
export const setStoredPhantomSession = (session: PhantomSession | null) => {
  storedPhantomSession = session;
};

// 1. Generate a Keypair for the App
export const generateDappKeypair = () => {
  const keypair = nacl.box.keyPair();
  return {
    publicKey: bs58.encode(keypair.publicKey),
    secretKey: keypair.secretKey,
  };
};

// 2. Create the "Connect" Deep Link
export const buildConnectUrl = (dappPublicKey: string, redirectLink: string) => {
  const params = new URLSearchParams({
    dapp_encryption_public_key: dappPublicKey,
    cluster: 'devnet',
    app_url: 'https://koshpay.com', // Your website
    redirect_link: redirectLink,
  });
  return `${PHANTOM_BASE}/connect?${params.toString()}`;
};

// 3. Generic Decrypt Function (for Connect and Sign responses)
export const decryptPayload = (
  data: string, 
  nonce: string, 
  sharedSecret: Uint8Array
) => {
  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );

  if (!decryptedData) {
    throw new Error('Failed to decrypt data');
  }

  return JSON.parse(Buffer.from(decryptedData).toString('utf8'));
};

// Wrapper for Connect Response (keeps existing API compatible with some changes)
export const decryptConnectResponse = (
  phantomPublicKey: string, 
  nonce: string, 
  encryptedData: string, 
  dappSecretKey: Uint8Array
) => {
  const sharedSecret = nacl.box.before(
    bs58.decode(phantomPublicKey),
    dappSecretKey
  );

  const payload = decryptPayload(encryptedData, nonce, sharedSecret);
  return { payload, sharedSecret };
};

// 4. Encrypt Payload for SignAndSend / SignTransaction
export const encryptPayload = (payload: any, sharedSecret: Uint8Array) => {
  const nonce = nacl.randomBytes(24);
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  
  const encryptedPayload = nacl.box.after(
    payloadBuffer,
    nonce,
    sharedSecret
  );

  return {
    nonce: bs58.encode(nonce),
    payload: bs58.encode(encryptedPayload),
  };
};

// 5. Build "SignTransaction" Deep Link (Alternative to SignAndSend)
export const buildSignTransactionUrl = (
  dappPublicKey: string,
  nonce: string,
  encryptedPayload: string,
  session: string,
  redirectLink: string
) => {
  const params = new URLSearchParams({
    dapp_encryption_public_key: dappPublicKey,
    nonce,
    payload: encryptedPayload,
    session,
    // cluster: 'devnet', // REMOVE cluster for signTransaction if using manual submission, OR keep if required by Phantom. 
    // Docs say 'cluster' parameter IS supported for both. Keeping it.
    cluster: 'devnet',
    redirect_link: redirectLink,
  });
  return `${PHANTOM_BASE}/signTransaction?${params.toString()}`;
};

// Keeping this just in case, but we are switching to signTransaction
export const buildSignAndSendUrl = (
  dappPublicKey: string,
  nonce: string,
  encryptedPayload: string,
  session: string,
  redirectLink: string
) => {
  const params = new URLSearchParams({
    dapp_encryption_public_key: dappPublicKey,
    nonce,
    payload: encryptedPayload,
    session,
    cluster: 'devnet',
    redirect_link: redirectLink,
  });
  return `${PHANTOM_BASE}/signAndSendTransaction?${params.toString()}`;
};
