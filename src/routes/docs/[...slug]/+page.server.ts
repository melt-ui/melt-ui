import { navConfig } from '$docs/config.js';
import { GITHUB_TOKEN } from '$env/static/private';
import type { EntryGenerator, PageLoad } from './$types.js';

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

let storedContributors: FullContributor[] | undefined;

const getContributors = async () => {
	if (!storedContributors) {
		try {
			// eslint-disable-next-line no-console
			console.log('Fetching contributors...');
			const res = await fetch(`https://api.github.com/repos/melt-ui/melt-ui/contributors`, {
				headers: {
					Authorization: `Bearer ${GITHUB_TOKEN}`,
				},
			});

			const contributors = (await res.json()) as Contributor[];

			const contributorsWithName = (await Promise.all(
				contributors.map(async (contributor) => {
					const res = await fetch(`https://api.github.com/users/${contributor.login}`, {
						headers: {
							Authorization: `Bearer ${GITHUB_TOKEN}`,
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

			storedContributors = contributorsWithName.filter(({ login }) => !login.includes('[bot]'));
			// eslint-disable-next-line no-console
			console.log(`Fetched ${storedContributors.length} contributors`);
		} catch {
			return [];
		}
	}

	return storedContributors;
};

export const load: PageLoad = async () => {
	return {
		contributors: await getContributors(),
	};
};
