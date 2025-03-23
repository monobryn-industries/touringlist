import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
	projectId: 'otltlc56',
	dataset: 'production',
	apiVersion: '2021-10-21',
	useCdn: true
});

const builder = imageUrlBuilder(client);

function urlForImage(source: any) {
	return builder.image(source);
}

// Process resources to include formatted image URLs
function processResourceImages(resources: any[]) {
	return resources.map((resource) => {
		// Create a copy of the resource to add image URLs
		const processedResource = { ...resource };

		// Only process image if it exists
		if (resource.image) {
			processedResource.imageUrl = urlForImage(resource.image).format('webp').quality(50).url();
		}

		// Only process favicon if it exists
		if (resource.favicon) {
			processedResource.faviconUrl = urlForImage(resource.favicon).width(48).format('webp').url();
		}

		return processedResource;
	});
}

export async function load() {
	const data = await client.fetch(`*[_type == "resource"]`);

	// Process all resources to include image URLs
	const processedData = processResourceImages(data).sort((a, b) => a.name.localeCompare(b.name));

	const all = processedData;

	const overnight = processedData.filter((resource) => resource.section === 'Overnight');

	const routing = processedData.filter((resource) => resource.section === 'Routing');

	const advice = processedData.filter((resource) => resource.section === 'Advice');

	const other = processedData.filter((resource) => resource.section === 'Other');

	if (data) {
		return {
			status: 200,
			data: {
				all,
				overnight,
				routing,
				advice,
				other
			}
		};
	}
	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
}
