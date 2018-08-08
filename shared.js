
function mapId(node) {
	node.id = node._id;
	return node;
}

// works for small lists
function mapArrayId(node, index) {
	node.id = index + 1;
}

function isDraft(object) {
	return (object.status && object.status === 'draft');
}

module.exports = {
	mapId,
	mapArrayId,
	isDraft,
	sharedFields: {
		bucketSlug: {
			key: 'bucketSlug',
			required: true,
			label: 'Bucket',
			helpText: `The Cosmic JS Bucket containing this Object`,
			dynamic: 'bucketList.slug.name',
			altersDynamicFields: true,
		},
		objectStatus: {
			key: 'baseObjectStatus',
			required: true,
			label: 'Object Status',
			default: 'published',
			helpText: 'Select the preferred status state of the objects.',
			choices: {
				published: 'Published',
				draft: 'Draft',
			},
		},
		objectType: (z, bundle) => {
			// the cosmic bucket slug to reference
			const {
				bucketSlug,
			} = bundle.inputData;

			return z.request(`https://api.cosmicjs.com/v1/${bucketSlug}/object-types`)
				.then(r => r.json.object_types)
				.then((types) => {
					return {
						key: 'objectType',
						label: 'Object Type',
						required: true,
						helpText: 'The Object type to use when creating this Object',
						choices: Object.assign({}, ...types.map(t => ({ [t.slug]: t.title })))
					};
				});
		},
	},
	examples: {
		object: {
			slug: "cosmic-js-example",
			title: "Cosmic JS Example",
			content: "Learning the Cosmic JS API is really fun and so easy",
			metafields: [{
					title: "Headline",
					key: "headline",
					type: "text",
					value: "Learn Cosmic JS!"
				},
				{
					title: "Author",
					key: "author",
					type: "text",
					value: "Quasar Jones"
				}
			],
			bucket: "568c5bbefd0dce302c000001",
			type_slug: "examples",
			created_at: "2016-01-06T00:28:39.982Z",
			_id: "568c5fb72f0c5d532d000001",
			options: {
				slug_field: false
			}
		},
		media: {
			name: "c20391e0-b8a4-11e6-8836-fbdfd6956b31-bird.jpg",
			original_name: "bird.jpg",
			size: 457307,
			type: "image/jpeg",
			bucket: "5839c67f0d3201c114000004",
			created: "2016-12-02T15:34:05.054Z",
			location: "https://cosmicjs.com/uploads",
			url: "https://s3-us-west-2.amazonaws.com/cosmicjs/c20391e0-b8a4-11e6-8836-fbdfd6956b31-bird.jpg",
			imgix_url: "https://cosmic-s3.imgix.net/c20391e0-b8a4-11e6-8836-fbdfd6956b31-bird.jpg",
			metadata: [
				{
					key: "caption",
					value: "Beautiful picture of the beach"
				}, {
					key: "credit",
					value: "Tyler Jackson"
				}
			],
		}
	}
}
