import { Readable } from 'stream';

export async function streamToString(stream: Readable) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks as Uint8Array[]).toString('utf-8');
}
