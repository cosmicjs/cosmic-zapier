
const { mapId, isDraft, sharedFields, examples } = require('../shared');

const VALID_OBJECT_STATUS = ['published', 'draft'];

const validStatus = status => (VALID_OBJECT_STATUS.includes(status)
	? status : VALID_OBJECT_STATUS[0]);

function baseSubscribe(z, bundle, data) {
	z.console.log('begin subscribe process');
	// the cosmic bucket slug to reference
	const {
		bucketSlug,
	} = bundle.inputData;

	// You can build requests and our client will helpfully inject all the variables
	// you need to complete. You can also register middleware to control this.

	const url = `https://api.cosmicjs.com/v1/${bucketSlug}/webhooks`;
	const body = JSON.stringify(data);

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		url,
		body,
	};

	z.console.log(`sending subscribe payload to ${url} ${body}`);
	// You may return a promise or a normal data structure from any perform method.
	return z.request(options)
		.then(res => {
			z.console.log(`received response ${res.content}`);
			return res.json.webhook;
		});
}

function unsubscribeHook(z, bundle) {
	// bundle.subscribeData contains the parsed response JSON from the subscribe
	// request made initially.
	const hookId = bundle.subscribeData.id;

	// You can build requests and our client will helpfully inject all the variables
	// you need to complete. You can also register middleware to control this.

	// the cosmic bucket slug to reference
	const {
		bucketSlug,
	} = bundle.inputData;

	const options = {
		url: `https://api.cosmicjs.com/v1/${bucketSlug}/webhooks/${hookId}`,
		method: 'DELETE',
	};

	// You may return a promise or a normal data structure from any perform method.
	return z.request(options)
		.then(res => res.json);
}

const _status = bundle => validStatus(bundle.inputData.baseObjectStatus);

const getFallbackNewObjects = (z, bundle) => {
	// For the test poll, you should get some real data, to aid the setup process.

	// the cosmic bucket slug to reference
	const {
		bucketSlug,
	} = bundle.inputData;

	const onlyDraft = _status(bundle) === 'draft';

	const options = {
		url: `https://api.cosmicjs.com/v1/${bucketSlug}/objects`,
		params: {
			limit: 50,
		}
	};

	// force query of all objects if draft is set
	if (onlyDraft) options.params.status = 'all';

	return z.request(options)
		.then(res => {
			const results = res.json.objects.map(mapId);
			return onlyDraft ? results.filter(isDraft) : results;
		});
};

const getFallbackNewMedia = (z, bundle) => {
	const {
		bucketSlug,
	} = bundle.inputData;

	const options = {
		url: `https://api.cosmicjs.com/v1/${bucketSlug}/media`,
		params: {
			limit: 50,
		}
	};

	return z.request(options)
		.then(res => res.json.media.map(mapId));
};

module.exports = {
	validStatus,
	_status,
	baseSubscribe,
	unsubscribeHook,
	sharedFields,
	examples,
	getFallbackNewObjects,
	getFallbackNewMedia,
};
