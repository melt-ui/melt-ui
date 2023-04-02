import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

type ViolationsResult = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

export async function axeViolations(page: Page): Promise<ViolationsResult> {
  // @ts-expect-error Due to a bug in Playwright, we need to use the default export 
  // https://github.com/dequelabs/axe-core-npm/issues/601
  const accessibilityScanResults = await new AxeBuilder.default({ page }).include('#root').analyze();
  return accessibilityScanResults.violations;
}