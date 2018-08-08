
const { sharedFields, examples } = require('./_base');

module.exports = {
	key: 'createObject',

	// You'll want to provide some helpful display labels and descriptions
	// for users. Zapier will put them into the UX.
	noun: 'Object',
	display: {
		label: 'Create New Object',
		description: 'Creates a new Cosmic JS Object.'
	},

	// `operation` is where the business logic goes.
	operation: {
		inputFields: [
			sharedFields.bucketSlug,
			sharedFields.objectType,
			sharedFields.objectStatus,
			{
				key: 'title',
				label: 'Title',
				required: true,
				type: 'string',
				helpText: 'The title of the Cosmic JS Object to create',
			},
			{
				key: 'content',
				label: 'Content',
				required: true,
				type: 'text',
				helpText: 'The content of the Cosmic JS Object to create'
			},
		],
		perform: (z, bundle) => {
			// the cosmic bucket slug to reference
			const {
				bucketSlug,
				objectType,
				title,
				objectStatus,
				content,
			} = bundle.inputData;

			const json = {
				title,
				content,
				status: objectStatus,
				type_slug: objectType,
			};

			const body = JSON.stringify(json);

			z.console.log(`preparing to create object ${body}`);

			const promise = z.request({
				url: `https://api.cosmicjs.com/v1/${bucketSlug}/add-object`,
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body,
			});

			return promise.then(res => res.json);
		},

		// In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
		// from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
		// returned records, and have obviously dummy values that we can show to any user.
		sample: examples.object,
	}
};
