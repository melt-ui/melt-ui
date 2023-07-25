<!-- https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ -->

<script lang="ts">
	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';

	const treeItems: TreeItem[] = [
		{
			title: 'lib',
			icon: 'folder',
			children: [
				{
					title: 'tree',
					icon: 'folder',
					children: [
						{
							title: 'Tree.svelte',
							icon: 'svelte',
						},
						{
							title: 'TreeView.svelte',
							icon: 'svelte',
						},
					],
				},
			],
		},
		{
			title: 'src',
			icon: 'folder',
			children: [
				{
					title: 'routes',
					icon: 'folder',
					children: [
						{
							title: '+layout.svelte',
							icon: 'svelte',
						},
						{
							title: '+page.svelte',
							icon: 'svelte',
						},
					],
				},
			],
		},
	];
</script>

<ul>
	<Tree {treeItems} />
</ul>

<!-- <p>
	<label>
		File or Folder Selected:
		<input id="last_action" type="text" size="15" readonly="" />
	</label>
</p>

<h3 id="tree_label">My Documents</h3>
<ul role="tree" aria-labelledby="tree_label">
	<li role="treeitem" aria-expanded="false" aria-selected="false">
		<span> Projects </span>
		<ul role="group">
			<li role="treeitem" aria-selected="false" class="doc">project-1.docx</li>
			<li role="treeitem" aria-selected="false" class="doc">project-2.docx</li>
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> Project 3 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						project-3A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-3B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-3C.docx
					</li>
				</ul>
			</li>
			<li role="treeitem" aria-selected="false" class="doc">project-4.docx</li>
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> Project 5 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						project-5A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-5B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-5C.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-5D.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-5E.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						project-5F.docx
					</li>
				</ul>
			</li>
		</ul>
	</li>
	<li role="treeitem" aria-expanded="false" aria-selected="false">
		<span> Reports </span>
		<ul role="group">
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> report-1 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						report-1A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-1B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-1C.docx
					</li>
				</ul>
			</li>
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> report-2 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						report-2A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-2B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-2C.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-2D.docx
					</li>
				</ul>
			</li>
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> report-3 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						report-3A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-3B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-3C.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						report-3D.docx
					</li>
				</ul>
			</li>
		</ul>
	</li>
	<li role="treeitem" aria-expanded="false" aria-selected="false">
		<span> Letters </span>
		<ul role="group">
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> letter-1 </span>
				<ul>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-1A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-1B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-1C.docx
					</li>
				</ul>
			</li>
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> letter-2 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						letter-2A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-2B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-2C.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-2D.docx
					</li>
				</ul>
			</li>
			<li role="treeitem" aria-expanded="false" aria-selected="false">
				<span> letter-3 </span>
				<ul role="group">
					<li role="treeitem" aria-selected="false" class="doc">
						letter-3A.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-3B.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-3C.docx
					</li>
					<li role="treeitem" aria-selected="false" class="doc">
						letter-3D.docx
					</li>
				</ul>
			</li>
		</ul>
	</li>
</ul> -->
