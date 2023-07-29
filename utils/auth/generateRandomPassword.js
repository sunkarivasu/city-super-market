const generateRandomPassword = (length = 8, rules = [1, 1, 1, 1]) => {
    try {
        validateParams(length, rules);
        const allChars = prepareTokens(rules);
        const password = Array(length);

        allChars.forEach(chars => {
            setRandomChar(password, chars[Math.floor(Math.random() * chars.length)]);
            setRandomChar(password, chars[Math.floor(Math.random() * chars.length)]);
        });

        for (let i = 8; i < length; i++) {
            setRandomChar(password, allChars[Math.floor(Math.random() * allChars.length)][Math.floor(Math.random() * allChars.length)]);
        };

        return password.join('');
    } catch (err) {
        throw err;
    }
}

const setRandomChar = (password, char) => {
    let index = Math.floor(Math.random() * password.length);
    while (password[index]) {
        index = index + 1;
        index = index % password.length;
    }

    password[index] = char;
};

const validateParams = (length, rules) => {
    if (length < 8) throw new Error('[randomPasswordGenerator] Password length must be at least 8 characters long', 422);

    if (rules.length !== 4) throw new Error('[randomPasswordGenerator] Password rules must be an array of length 4', 422);

    if (rules.every(rule => rule === 0)) throw new Error('[randomPasswordGenerator] At least one rule must be enabled', 422);
}

const prepareTokens = (rules) => {
    const chars = {
        lowerCaseLetters: "abcdefghijklmnopqrstuvwxyz",
        upperCaseLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        specialCharacters: "!@#$%^&*()_-"
    };
    const allChars = [];
    rules.forEach((rule, index) => {
        if (rule) allChars.push(chars[Object.keys(chars)[index]]);
    });

    return allChars;
}

module.exports = generateRandomPassword;