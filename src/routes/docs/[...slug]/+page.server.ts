import { navConfig } from '$docs/config.js';
import type { EntryGenerator, PageLoad } from './$types.js';
import fs from 'fs';

import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import type { F } from 'vitest/dist/reporters-1evA5lom.js';

export const entries = (() => {
	return navConfig.sidebarNav[0].items.map((item) => {
		return { slug: item.title.toLowerCase().replaceAll(' ', '-') };
	});
}) satisfies EntryGenerator;

export type Contributor = {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	contributions: number;
};

export type FullContributor = Contributor & { name: string; bio: string };

async function getContributors(page: number) {
	return await fetch(
		`https://api.github.com/repos/melt-ui/melt-ui/contributors?page=${page}&per_page=100`, {
		headers: {
			Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		},
	}
	).then((r) => r.json());
}


async function getAllContributors(): Promise<FullContributor[]> {
	if (building || !fs.existsSync('src/json/contributors.json')) {
		try {
			// eslint-disable-next-line no-console
			console.log('Fetching contributors...');

			let page = 1;
			let contributors: Contributor[] = [];
			let data = await getContributors(page);
			while (data.length > 0) {
				contributors = contributors.concat(data);
				page++;
				data = await getContributors(page);
			}

			console.log('Contributors:', contributors.length);

			const contributorsWithName = (await Promise.all(
				contributors.map(async (contributor) => {
					const res = await fetch(`https://api.github.com/users/${contributor.login}`, {
						headers: {
							Authorization: `Bearer ${env.GITHUB_TOKEN}`,
						},
					});
					const { name, bio } = await res.json();
					return {
						...contributor,
						name,
						bio,
					};
				})
			)) as FullContributor[];

			fs.writeFileSync('src/json/contributors.json', JSON.stringify(contributorsWithName, null, 2));
			return contributorsWithName;
		} catch {
			return []
		}
	}

	return JSON.parse(fs.readFileSync('src/json/contributors.json', 'utf-8'));
};

export const load: PageLoad = async () => {
	return {
		contributors: await getAllContributors(),
	};
};
