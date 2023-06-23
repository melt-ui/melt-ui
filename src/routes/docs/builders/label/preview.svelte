<script lang="ts">
  import { createLabel } from '$lib';
  import { Docs } from '$routes/(components)';

  const { asterisk } = createLabel({
    isRequired: true
  });
</script>

<Docs.PreviewWrapper>
  <form>
    <div class="flex flex-col items-start justify-center">
      <label for="email" class="text-black">
        <span>Email
          <span {...$asterisk}>*</span>
        </span>
      </label>
        <input type="text" id="email" class="h-10 rounded-lg text-black px-2" placeholder="vanilla@melt-ui.com" />
    </div>
  </form>
</Docs.PreviewWrapper>