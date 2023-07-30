exports.isEmpty = value => value === undefined || value === null || typeof value === 'object' && Object.keys(value).length === 0 || typeof value === 'string' && value.trim().length === 0;

// TODO: Update this function to support nested objects
exports.trimReqBody = reqBody => {
    if (typeof reqBody === 'object' && !Array.isArray(reqBody)) {
        for (let key in reqBody) {
            if (typeof reqBody[key] === 'string') {
                reqBody[key] = reqBody[key].trim();
            }
        }
    }

    return reqBody;
};