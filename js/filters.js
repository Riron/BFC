/**
 * Filters
 */

app.filter('truncate', function () {
    return function (input, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (input.length <= length || input.length - end.length <= length) {
            return input;
        }
        else {
            return String(input).substring(0, length-end.length) + end;
        }

    };
});