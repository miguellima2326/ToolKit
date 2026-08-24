export * from './types';
export * from './categories';
export { appsA } from './apps-a';
export { appsB } from './apps-b';
export { drivers, hardwareVendors } from './drivers';
export { collections } from './collections';

import { appsA } from './apps-a';
import { appsB } from './apps-b';

export const allApps = [...appsA, ...appsB];
