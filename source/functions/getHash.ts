import crypto from 'crypto';

export const getHash = (data: string): string =>
	crypto.createHash('sha256').update(data).digest('hex');
