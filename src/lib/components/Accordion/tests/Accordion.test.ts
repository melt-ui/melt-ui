import { expect, test } from '@playwright/experimental-ct-svelte';

import AccordionTest from './AccordionTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Accordion', () => {
  test.describe('Single', () => {
    test.beforeEach(async ({ mount }) => {
      await mount(AccordionTest, { props: { type: 'single' } });
    });

    test('No accesibility violations', async ({ page }) => {
      expect(await axeViolations(page)).toEqual([]);
    })
  });
});
