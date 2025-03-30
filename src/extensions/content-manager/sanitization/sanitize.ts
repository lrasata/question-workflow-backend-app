
const sanitizeAllValues = (data, sanitizeFn) => {
    if (typeof data !== 'object' || data === null) {
        return sanitizeFn(data); // Apply function to non-object values
    }

    if (Array.isArray(data)) {
        return data.map(item => sanitizeAllValues(item, sanitizeFn)); // Handle arrays
    }

    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, sanitizeAllValues(value, sanitizeFn)])
    );
}

const removeHtmlTags = (str: string) => {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    // Regular expression to identify HTML tags in the input string.
    // Replacing the identified HTML tag with an empty string.
    // Remove heading and trailing white spaces
    return str.replace(/(<([^>]+)>)/ig, '').trim();
}

export const sanitize = (data) => {
    strapi.log.info('Request body is being sanitized');
    return sanitizeAllValues(data, (value: string) => removeHtmlTags(value) );
}

