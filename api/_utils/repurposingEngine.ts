import { generateRepurposingSuite as originalSuite } from '../../src/utils/repurposingEngine';

export function generateRepurposingSuite(diseaseName: string) {
  return originalSuite(diseaseName);
}
