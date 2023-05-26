<script lang="ts">
	import { Tooltip } from '../index';
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger aria-label="Add to library">+</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content>
				Add to library
				<Tooltip.Arrow />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
