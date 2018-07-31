$(document).ready(function () {
    getLongHistory();
});

function getLongHistory() {
    $.getJSON('data/polls.json', function (res) {
        // res = polls;
        var sorted = res;//res.sort(sortByDate);//.reverse();
        $("#historyLongTable").empty();
        $("#historyLongTable").append($(
            '<tr>' +
            '<th>Period</th>' +
            '<th>Publiserat</th>' +
            '<th>Institut</th>' +
            '<th>Fi</th>' +
            '<th>V</th>' +
            '<th>S</th>' +
            '<th>MP</th>' +
            '<th>SD</th>' +
            '<th>C</th>' +
            '<th>L</th>' +
            '<th>M</th>' +
            '<th>KD</th>' +
            // '<th>Övriga</th>' +
            '<th>Osäkra</th>' +
            '<th>Intervjuade</th>' +
            '<th>Period från</th>' +
            '<th>Period till</th>' +
            '</tr>'
        ));
        $.each(sorted, function (i, row) {
            $("#historyLongTable").append($(
                '<tr class="historyRow">' +
                '<td>' + getValue(row.PublYearMonth) + '</td>' +
                '<td>' + getValue(row.PublDate) + '</td>' +
                '<td>' + getValue(row.house) + '</td>' +
                '<td>' + getValue(row.FI) + '</td>' +
                '<td>' + getValue(row.V) + '</td>' +
                '<td>' + getValue(row.S) + '</td>' +
                '<td>' + getValue(row.MP) + '</td>' +
                '<td>' + getValue(row.SD) + '</td>' +
                '<td>' + getValue(row.C) + '</td>' +
                '<td>' + getValue(row.L) + '</td>' +
                '<td>' + getValue(row.M) + '</td>' +
                '<td>' + getValue(row.KD) + '</td>' +
                // '<td>' + getValue(row.n) + '</td>' +
                '<td>' + getValue(row.Uncertain) + '</td>' +
                '<td>' + getValue(row.n) + '</td>' +
                '<td>' + getValue(row.collectPeriodFrom) + '</td>' +
                '<td>' + getValue(row.collectPeriodTo) + '</td>' +
                '</tr>'));
        });
    });
}

function getValue(value) {
    if (value)
        return value;
    else
        return '-';
}

function sortByDate(a, b) {
    return new Date(a.PublDate) - new Date(b.PublDate);
}