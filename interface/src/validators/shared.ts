import Schema, { InternalRuleItem, ValidateOption } from "async-validator";

export const validate = <T extends object>(
	validator: Schema,
	source: Partial<T>,
	options?: ValidateOption
): Promise<T> => {
	return new Promise((resolve, reject) => {
		validator.validate(
			source,
			options ? options : {},
			(errors, fieldErrors) => {
				if (errors) {
					reject(fieldErrors);
				} else {
					resolve(source as T);
				}
			}
		);
	});
};

const IP_ADDRESS_REGEXP =
	// eslint-disable-next-line max-len
	/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const isValidIpAddress = (value: string) => IP_ADDRESS_REGEXP.test(value);

export const IP_ADDRESS_VALIDATOR = {
	validator(
		rule: InternalRuleItem,
		value: string,
		callback: (error?: string) => void
	) {
		if (value && !isValidIpAddress(value)) {
			callback("Must be an IP address");
		} else {
			callback();
		}
	},
};

const HOSTNAME_LENGTH_REGEXP = /^.{0,253}$/;
const HOSTNAME_PATTERN_REGEXP =
	/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/;

const isValidHostname = (value: string) =>
	HOSTNAME_LENGTH_REGEXP.test(value) && HOSTNAME_PATTERN_REGEXP.test(value);

export const HOSTNAME_VALIDATOR = {
	validator(
		rule: InternalRuleItem,
		value: string,
		callback: (error?: string) => void
	) {
		if (value && !isValidHostname(value)) {
			callback("Must be a valid hostname of up to 253 characters");
		} else {
			callback();
		}
	},
};

export const IP_OR_HOSTNAME_VALIDATOR = {
	validator(
		rule: InternalRuleItem,
		value: string,
		callback: (error?: string) => void
	) {
		if (value && !(isValidIpAddress(value) || isValidHostname(value))) {
			callback(
				"Must be a valid IP address or hostname of up to 253 characters"
			);
		} else {
			callback();
		}
	},
};
