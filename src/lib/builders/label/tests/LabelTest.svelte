<script lang="ts">
  import { createLabel } from '..';

  export let isRequired = false;
  export let inputId = 'test'

  const { root, labelValue, labelContainer } = createLabel({
    isRequired,
    for: inputId,
    labelValue: 'Test'
  });
</script>

<div>
  <label {...$root}>
    <span {...$labelContainer}>{$labelValue}</span>
    <input type="text" id={inputId} />
  </label>
</div>