module.exports  = function (value) {
    try {
        JSON.parse(value);
        return true;
    } catch (error) {
        return false
    }
}
