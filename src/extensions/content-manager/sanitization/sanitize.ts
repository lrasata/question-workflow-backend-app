
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

const removeHTMLTags = (str: string) => {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '');
}

const sanitize = (data) => {
    return sanitizeAllValues(data, (value: string) => removeHTMLTags(value) );
}

