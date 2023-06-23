<script lang="ts">
  import { createLabel } from '..';

  export let isRequired = false;
  export let inputId = 'test'

  const { root, asterisk } = createLabel({
    isRequired
  });
</script>

<form>
  <div>
    <label {...$root} for={inputId}>
      <span>Test
        <span {...$asterisk}>*</span>
      </span>
      <input type="text" id={inputId} />
    </label>
  </div>
</form>