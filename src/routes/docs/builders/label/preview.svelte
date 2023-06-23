<script lang="ts">
  import { createLabel } from '$lib';
  import { Docs } from '$routes/(components)';

  const { root, labelValue, asterisk } = createLabel({
    isRequired: true,
    for: 'email',
    labelValue: 'Email',
  });
</script>

<Docs.PreviewWrapper>
  <form>
    <div class="flex flex-col items-start justify-center">
      <label for={$root.for} class="text-black">
        <span>
          {$labelValue}
          <span {...$asterisk}>*</span>
        </span>
      </label>
        <input type="text" id="email" class="h-10 rounded-lg text-black px-2" placeholder="vanilla@melt-ui.com" />
    </div>
  </form>
</Docs.PreviewWrapper>