const addHexAndDecimalToHash  = (hexNum, decNum) => {
    // Convert the hex number to decimal
    const decimalFromHex = parseInt(hexNum, 16);

    // Add the decimal number to the converted hex number
    const result = decimalFromHex + decNum;

    // Limit the result to a 6 hexadecimal digit number (24 bits)
    // This ensures the result fits in the range of 6 hex digits
    const limitedResult = result % (16 ** 6); // 16^6 = 0xFFFFFF + 1

    // Convert the result to a 6-character hexadecimal string
    const hexResult = limitedResult.toString(16).toUpperCase().padStart(6, '0');

    return hexResult;
}

module.exports = {
    addHexAndDecimalToHash
}