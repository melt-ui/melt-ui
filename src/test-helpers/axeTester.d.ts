import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
type ViolationsResult = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];
export declare function axeViolations(page: Page): Promise<ViolationsResult>;
export {};
