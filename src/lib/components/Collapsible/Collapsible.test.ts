import { Collapsible } from './index';
import { render, type RenderResult, fireEvent } from '@testing-library/svelte'
import { axe } from 'jest-axe';
import html from 'svelte-htm';

const TRIGGER_TEXT = 'Trigger';
const CONTENT_TEXT = 'Content';

const CollapsibleTest = (props?: any[]) => html`<${Collapsible.Root} $$props=${props}>
  <${Collapsible.Trigger}>${TRIGGER_TEXT}</${Collapsible.Trigger}>
  <${Collapsible.Content}>${CONTENT_TEXT}</${Collapsible.Content}>
</${Collapsible.Root}>`;

describe("Collapsible", () => {

  let rendered: RenderResult<any>;
  let trigger: HTMLElement;
  let content: HTMLElement | null;

  beforeEach(() => {
    rendered = render(CollapsibleTest());
    trigger = rendered.getByText(TRIGGER_TEXT);
  });


  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });


  describe('when clicking the trigger', () => {
    beforeEach(async () => {
      await fireEvent.click(trigger);
      content = rendered.queryByText(CONTENT_TEXT);
    });

    it('should open the content', () => {
      expect(content).toBeVisible();
    });

    describe('and clicking the trigger again', () => {
      beforeEach(async () => {
        await fireEvent.click(trigger);
      });

      it('should close the content', async () => {
        expect(content).not.toBeVisible();
      });
    });
  });
});