type ResourceCost = 'Free' | 'Freemium' | 'Paid' | 'Subscription';

interface BlockContent {
	_type: string;
	_key: string;
	style?: string;
	children?: Array<{
		_type: string;
		_key: string;
		text?: string;
		marks?: string[];
	}>;
	markDefs?: Array<{
		_type: string;
		_key: string;
		href?: string;
	}>;
}

interface Slug {
	_type: 'slug';
	current: string;
}

type ResourceSection = 'Other' | 'Routing' | 'Overnight';

// Main Resource interface
export interface Resource {
	_type: 'resource';
	_id: string;
	_rev: string;
	_createdAt: string;
	_updatedAt: string;

	// Content fields
	name: string;
	section: ResourceSection;
	url: string;
	description: BlockContent[];
	type: string[];
	slug: Slug;
	cost: ResourceCost;
	locations: string[];
	image: string;
	imageUrl: string;
}
