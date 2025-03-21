import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
	projectId: 'otltlc56',
	dataset: 'production',
	apiVersion: '2021-10-21',
	useCdn: false
});

const builder = imageUrlBuilder(client);

function urlForImage(source: any) {
	return builder.image(source);
}

// Process resources to include formatted image URLs
function processResourceImages(resources: any[]) {
	return resources.map((resource) => {
		// Check if the resource has an image field
		if (resource.image) {
			// Add a formatted URL to the resource
			return {
				...resource,
				imageUrl: urlForImage(resource.image).format('webp').quality(50).url()
			};
		}
		return resource;
	});
}

export async function load() {
	const data = await client.fetch(`*[_type == "resource"]`);

	// Process all resources to include image URLs
	const processedData = processResourceImages(data);

	const all = processedData;

	const overnight = processedData.filter((resource) => resource.section === 'Overnight');

	const routing = processedData.filter((resource) => resource.section === 'Routing');

	const other = processedData.filter((resource) => resource.section === 'Other');

	if (data) {
		return {
			status: 200,
			data: {
				all,
				overnight,
				routing,
				other
			}
		};
	}
	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
}
