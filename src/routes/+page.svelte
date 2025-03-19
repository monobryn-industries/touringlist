<script lang="ts">
	import { Tabs } from 'bits-ui';
	import { Separator } from 'bits-ui';
	import { PortableText } from '@portabletext/svelte';

	import { type Resource } from '$lib/schema.ts';

	import Globe from 'phosphor-svelte/lib/Globe';
	import Tent from 'phosphor-svelte/lib/Tent';
	import MapTrifold from 'phosphor-svelte/lib/MapTrifold';
	import CloudSun from 'phosphor-svelte/lib/CloudSun';
	import CompassTool from 'phosphor-svelte/lib/CompassTool';
	import Path from 'phosphor-svelte/lib/Path';
	import Moon from 'phosphor-svelte/lib/Moon';
	import DotsNine from 'phosphor-svelte/lib/DotsNine';
	import Binoculars from 'phosphor-svelte/lib/Binoculars';
	import UsersThree from 'phosphor-svelte/lib/UsersThree';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import Bed from 'phosphor-svelte/lib/Bed';
	import House from 'phosphor-svelte/lib/House';
	import Farm from 'phosphor-svelte/lib/Farm';

	const { data } = $props();

	const resources = data.data;

	let tab = $state('all');
	let search = $state('');
	let sortBy = $state('type');

	let filteredResources = $derived(
		((resources?.[tab as keyof typeof resources] || resources?.all || []) as Resource[])
			.filter(
				(resource: Resource) =>
					search === '' ||
					resource.name.toLowerCase().includes(search.toLowerCase()) ||
					resource.locations?.some((location) =>
						location.toLowerCase().includes(search.toLowerCase())
					) ||
					resource.type?.some((type) => type.toLowerCase().includes(search.toLowerCase()))
			)
			.sort((a, b) => {
				if (sortBy === 'name') {
					return a.name.localeCompare(b.name);
				} else if (sortBy === 'location' && a.locations && b.locations) {
					return a.locations[0]?.localeCompare(b.locations[0] || '') || 0;
				} else if (sortBy === 'type' && a.type && b.type) {
					return a.type[0]?.localeCompare(b.type[0] || '') || 0;
				}
				return 0;
			})
	);
</script>

{#snippet trigger(value: string, label: string)}
	<Tabs.Trigger
		{value}
		class="border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card flex cursor-pointer items-center gap-2 border px-2 py-1.5 font-mono text-sm font-light data-[state=active]:border-transparent"
	>
		{#if value === 'routing'}
			<Path class="size-4" />
		{:else if value === 'overnight'}
			<Moon class="size-4" />
		{:else if value === 'miscellaneous'}
			<DotsNine class="size-4" />
		{/if}
		{label}</Tabs.Trigger
	>
{/snippet}

{#snippet tabContent()}
	<section class="flex grid-cols-2 flex-col gap-4 lg:grid">
		{#each filteredResources as resource (resource._id)}
			{@render resourceCard(resource)}
		{/each}
	</section>
{/snippet}

{#snippet resourceCard(resource: Resource)}
	<div class="border-border bg-card flex border">
		<div class=" h-auto w-40 flex-shrink-0 overflow-hidden">
			<a href={resource.url} target="_blank" class="h-full w-full">
				<img src={resource.imageUrl} alt={resource.name} class="h-full object-cover" />
			</a>
		</div>
		<div class="flex grow-0 flex-col gap-2 p-4">
			<a href={resource.url} target="_blank" class=" text-base font-normal">{resource.name}</a>
			<div class="flex flex-row flex-wrap items-center gap-2">
				{#each resource.locations as location (location)}
					<button
						class="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs"
						onclick={() => (search = location)}
					>
						<Globe class="size-4" />{location}
					</button>
				{/each}
				{#if resource.locations && resource.locations.length !== 0}
					<Separator.Root orientation="vertical" class="bg-border h-[12px] w-[1px]" />
				{/if}
				{#each resource.type as type (type)}
					<button
						class="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs select-auto"
						onclick={() => (search = type)}
					>
						{#if type === 'Camping'}
							<Tent class="size-4" />
						{:else if type === 'Planning'}
							<MapTrifold class="size-4" />
						{:else if type === 'Weather'}
							<CloudSun class="size-4" />
						{:else if type === 'Tool'}
							<CompassTool class="size-4" />
						{:else if type === 'Discover'}
							<Binoculars class="size-4" />
						{:else if type === 'Editor'}
							<Pencil class="size-4" />
						{:else if type === 'Paid Lodging'}
							<Bed class="size-4" />
						{:else if type === 'Community Hosting'}
							<House class="size-4" />
						{:else if type === 'Farm Stays'}
							<Farm class="size-4" />
						{:else if type === 'Community' || type === 'Social'}
							<UsersThree class="size-4" />
						{/if}
						{type}
					</button>
				{/each}
			</div>
			<div class="prose prose-sm prose-stone text-muted-foreground">
				<PortableText value={resource.description} />
			</div>
		</div>
	</div>
{/snippet}

<main class="container mx-auto px-4 pb-10 lg:px-8">
	<Tabs.Root bind:value={tab}>
		<div class="mb-4 flex flex-col gap-4 lg:flex-row lg:gap-4">
			<Tabs.List class="flex flex-wrap gap-1">
				{@render trigger('all', 'All')}
				{@render trigger('routing', 'Routing & Navigation')}
				{@render trigger('overnight', 'Overnight')}
				{@render trigger('miscellaneous', 'Miscellaneous')}
			</Tabs.List>
			<input
				placeholder="Filter"
				bind:value={search}
				type="text"
				class="bg-card border-border placeholder:text-muted-foreground h-[34px] border font-mono text-sm placeholder:font-mono placeholder:text-sm"
			/>
		</div>

		<Tabs.Content value="all">
			{@render tabContent()}
		</Tabs.Content>
		<Tabs.Content value="routing">
			{@render tabContent()}
		</Tabs.Content>
		<Tabs.Content value="overnight">
			{@render tabContent()}
		</Tabs.Content>
		<Tabs.Content value="miscellaneous">
			{@render tabContent()}
		</Tabs.Content>
	</Tabs.Root>
</main>
