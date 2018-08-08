
const { mapId } = require('../shared');

module.exports = {
	key: 'bucket',
	noun: 'Bucket',
	list: {
		display: {
			label: 'List Buckets',
			description: 'Lists available Cosmic JS buckets.',
			hidden: true,
		},
		operation: {
			perform: z => z
				.request('https://api.cosmicjs.com/v1/buckets')
				.then(r => r.json.buckets)
				.then(r => r.map(mapId)),
		},
	},

	sample: {
		id: '59b9f95c64c8e141230002e0',
		slug: 'your-bucket-slug',
		title: 'Your Bucket Name',
		created_at: '2018-08-07T23:55:25.077Z',
		modified_at: '2018-08-07T23:55:25.077Z'
	},

	outputFields: [
		{
			key: 'id',
			label: 'ID',
		},
		{
			key: 'slug',
			label: 'Slug',
		},
		{
			key: 'title',
			label: 'Title',
		},
	],
};
