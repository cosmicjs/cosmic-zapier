
const {
	_status,
	baseSubscribe,
	unsubscribeHook,
	sharedFields,
	examples,
	getFallbackNewObjects,
} = require('./_base');

const getObject = (z, bundle) => {
	const { data } = bundle.cleanedRequest;
	z.console.log(`received event for edited Object ${JSON.stringify(data)}`);

	// bundle.cleanedRequest will include the parsed JSON object (if it's not a
	// test poll) and also a .querystring property with the URL's query string.

	return [data];
};

module.exports = {
	key: 'editedObject',
	noun: 'Object',
	display: {
		label: 'Edited Object',
		description: 'Trigger when an existing Cosmic JS Object is edited.',
		important: true,
	},
	operation: {
		type: 'hook',

		inputFields: [
			sharedFields.bucketSlug,
			sharedFields.objectStatus,
		],

		performSubscribe: (z, bundle) => baseSubscribe(z, bundle, {
			endpoint: bundle.targetUrl,
			event: `object.edited.${_status(bundle)}`,
		}),

		performUnsubscribe: unsubscribeHook,

		perform: getObject,
		performList: getFallbackNewObjects,

		// In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
		// from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
		// returned records, and have obviously dummy values that we can show to any user.
		sample: examples.object,
	}
};
