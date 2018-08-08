
const {
	baseSubscribe,
	unsubscribeHook,
	sharedFields,
	examples,
	getFallbackNewMedia,
} = require('./_base');

const getMedia = (z, bundle) => {
	const { data } = bundle.cleanedRequest;
	z.console.log(`received event for edited Object ${JSON.stringify(data)}`);

	// bundle.cleanedRequest will include the parsed JSON object (if it's not a
	// test poll) and also a .querystring property with the URL's query string.

	return [data];
};

module.exports = {
	key: 'editedMedia',
	noun: 'Media',
	display: {
		label: 'Edited Media',
		description: 'Trigger when an existing Cosmic JS Media File is edited.'
	},
	operation: {
		type: 'hook',

		inputFields: [
			sharedFields.bucketSlug,
		],

		performSubscribe: (z, bundle) => baseSubscribe(z, bundle, {
			endpoint: bundle.targetUrl,
			event: 'media.edited',
		}),

		performUnsubscribe: unsubscribeHook,

		perform: getMedia,
		performList: getFallbackNewMedia,

		// In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
		// from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
		// returned records, and have obviously dummy values that we can show to any user.
		sample: examples.media,
	}
};
