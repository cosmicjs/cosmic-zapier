
const { version } = require('./package.json');
const core = require('zapier-platform-core');

const bucket = require('./resources/bucket');

const createObject = require('./creates/createObject');

const newObject = require('./triggers/newObject');
const editedObject = require('./triggers/editedObject');

const newMedia = require('./triggers/newMedia');
const editedMedia = require('./triggers/editedMedia');

// Now we can roll up all our behaviors in an App.
const App = {
	// This is just shorthand to reference the installed dependencies you have. Zapier will
	// need to know these before we can upload
	version,
	platformVersion: core.version,

	beforeRequest: [(request, z, bundle) => {
		request.headers.Authorization = `Bearer ${process.env.TEST_AUTH_KEY || bundle.authData.apiKey}`;
		return request;
	}],

	afterResponse: [],

	resources: {
		[bucket.key]: bucket,
	},

	// If you want your trigger to show up, you better include it here!
	triggers: {
		[newObject.key]: newObject,
		[editedObject.key]: editedObject,
		// [deletedObject.key]: deletedObject,
		[newMedia.key]: newMedia,
		[editedMedia.key]: editedMedia,
	},

	// If you want your searches to show up, you better include it here!
	searches: {},

	// If you want your creates to show up, you better include it here!
	creates: {
		[createObject.key]: createObject,
	},

	authentication: {
		type: 'custom',
		fields: [
			{
				key: 'apiKey',
				type: 'string',
				required: true,
				label: 'Comsic JS Secret Authentication Token',
				helpText: 'Your Comsic JS Secret Authentication Token (can be retrieved from https://cosmicjs.com/account/authentication)',
			},
		],
		test: (z) => {
			const promise = z.request('https://api.cosmicjs.com/v1/buckets');
			return promise.then((response) => {
				if (response.status !== 200) {
					throw new Error('Invalid API Key');
				}
			});
		},
	},
};

// Finally, export the app.
module.exports = App;
