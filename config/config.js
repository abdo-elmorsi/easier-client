const development_domain = "http://localhost:3001/api"
const production_domain = "https://fine-teal-kangaroo-hem.cyclic.app/api"//'https://fine-teal-kangaroo-hem.cyclic.app/api'

const development = {
	apiGateway: {
		API_URL_DEV: development_domain,
		API_URL_PRODUCTION: production_domain,


	},
	env: {
		EMAIL_SERVICE: "service_bkza1jq",
		EMAIL_TEMPLATE: "template_sg3x9yc",
		EMAIL_PUBLIC_ID: "JktKw-pvG4qKxka3v",
	}
}

const production = {
	apiGateway: {
		API_URL_DEV: development_domain,
		API_URL_PRODUCTION: production_domain,


	},
	env: {
		EMAIL_SERVICE: "service_bkza1jq",
		EMAIL_TEMPLATE: "template_sg3x9yc",
		EMAIL_PUBLIC_ID: "JktKw-pvG4qKxka3v",
	}
};

const config = process.env.NODE_ENV != "development" ? production : development;
export default config;