

export function removeEmptyStrings(StringArray) {
    if (StringArray instanceof Array) {
        let result = [];
        for (let i = 0; i < StringArray.length; i++) {
            if (!StringArray[i] == "") {
                result.push(StringArray[i]);
            }
        }
        return result;
    }
}

export function contains(array, item) {
    return array.some(elem => {
        return JSON.stringify(elem) === JSON.stringify(item);
    });
}

export function indexof(array, item) {
    return array.findIndex(x => JSON.stringify(x) === JSON.stringify(item))
}