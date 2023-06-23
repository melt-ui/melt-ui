<script lang="ts">
  import { createLabel } from '..';

  export let isRequired = false;
  export let inputId = 'test'

  const { root, labelValue, asterisk } = createLabel({
    isRequired,
    for: inputId,
    labelValue: 'Test'
  });
</script>

<div>
  <label {...$root}>
    <span>{$labelValue}
      <span {...$asterisk}>*</span>
    </span>
    <input type="text" id={inputId} />
  </label>
</div>