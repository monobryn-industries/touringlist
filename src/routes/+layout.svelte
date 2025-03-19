<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>touringlist</title>
	<meta name="description" content="A list of biketouring resources" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<Header />
{@render children()}
