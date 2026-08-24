export * from './types';
export * from './categories';
export { appsA } from './apps-a';
export { appsB } from './apps-b';
export { appsC } from './apps-c';
export { drivers, hardwareVendors } from './drivers';
export { collections } from './collections';

import { appsA } from './apps-a';
import { appsB } from './apps-b';
import { appsC } from './apps-c';

export const allApps = [...appsA, ...appsB, ...appsC];
