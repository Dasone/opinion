var width = 0;
var size = "";
var current = "all";
var pageIndex = 0;

var res;
var avgRes;

$(document).ready(function () {

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(initChart);

    $(window).on("resize", function () {
        onResize();
    });

    //onResize();

    $(".btn-all").click(function (e) {
        clickDataBtn("all", e);
    });
    $(".btn-fi").click(function (e) {
        clickDataBtn("party/FI", e);
    });
    $(".btn-v").click(function (e) {
        clickDataBtn("party/V", e);
    });
    $(".btn-s").click(function (e) {
        clickDataBtn("party/S", e);
    });
    $(".btn-mp").click(function (e) {
        clickDataBtn("party/MP", e);
    });
    $(".btn-sd").click(function (e) {
        clickDataBtn("party/SD", e);
    });
    $(".btn-c").click(function (e) {
        clickDataBtn("party/C", e);
    });
    $(".btn-l").click(function (e) {
        clickDataBtn("party/L", e);
    });
    $(".btn-m").click(function (e) {
        clickDataBtn("party/M", e);
    });
    $(".btn-kd").click(function (e) {
        clickDataBtn("party/KD", e);
    });
    $(".btn-sifo").click(function (e) {
        clickDataBtn("institute/Sifo", e);
    });
    $(".btn-yougov").click(function (e) {
        clickDataBtn("institute/YouGov", e);
    });
    $(".btn-demoskop").click(function (e) {
        clickDataBtn("institute/Demoskop", e);
    });
    $(".btn-ipsos").click(function (e) {
        clickDataBtn("institute/Ipsos", e);
    });
    $(".btn-novus").click(function (e) {
        clickDataBtn("institute/Novus", e);
    });
    $(".btn-scb").click(function (e) {
        clickDataBtn("institute/SCB", e);
    });
    $(".btn-inizio").click(function (e) {
        clickDataBtn("institute/Inizio", e);
    });
    $(".btn-sentio").click(function (e) {
        clickDataBtn("institute/Sentio", e);
    });
    $(".btn-skop").click(function (e) {
        clickDataBtn("institute/Skop", e);
    });
    $(".btn-left").click(function () {
        pageIndex++;
        clickDataBtn(current, null);
    });
    $(".btn-right").click(function () {
        pageIndex--;
        clickDataBtn(current, null);
    });
    // $(".btn-valresultat").click(function (e) {
    //     clickDataBtn("institute/SVT VALU", e);
    // });
});

function clickDataBtn(target, e) {
    current = target;
    getGraph(target, res);
    if (e)
        togglePressBtn(e.target);
}

function togglePressBtn(btn) {
    $(".btn-data").removeClass("active");
    $(btn).addClass("active");
}

function togglePressBtnDates(btn) {
    $(".btn-navbar").removeClass("active");
    $(btn).addClass("active");
}

function onResize() {
    tmpWidth = $("#main_container").width();
    if (width !== tmpWidth) {
        width = tmpWidth;

        if (width >= 1110)
            size = "huge";
        else if (width >= 930)
            size = "large";
        else if (width >= 690)
            size = "medium";
        else
            size = "small";


        getGraph(current, res);
    }
    drawColumnChartValresultat();
    drawComboChartNuvarandeManadAvg(res);
}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return JSON.stringify(indexed_array);
}

function initChart() {
    $.getJSON('data/polls.json', function (result) {
    res = result;
    // res = polls;
    // getGraph(current, res);
    // drawColumnChartValresultat();
    // drawComboChartNuvarandeManadAvg(res);
    getHistory(res);
    onResize();
    });
}

function getGraph(path, res) {
    if (path === 'all') {
        createGraphAll(res);
    } else if (path.includes('party')) {
        createGraphParty(res, path.replace('party/', ''));
    } else if (path.includes('institute')) {
        createGraphInstitute(res, path.replace('institute/', ''));
    }
}

function createGraphParty(data, party) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'date');
    dataTable.addColumn('number', 'Sifo');
    dataTable.addColumn('number', 'YouGov');
    dataTable.addColumn('number', 'Demoskop');
    dataTable.addColumn('number', 'Ipsos');
    dataTable.addColumn('number', 'Novus');
    dataTable.addColumn('number', 'SCB');
    dataTable.addColumn('number', 'Inizio');
    dataTable.addColumn('number', 'Sentio');
    dataTable.addColumn('number', 'Skop');
    dataTable.addColumn('number', 'medel');
    dataTable.addColumn('number', '');

    var parties = getParty(data, party);
    dataTable.addRows(parties);

    var chart = new google.visualization.LineChart(document.getElementById('graphContainer'));

    var series = {
        9: {
            lineWidth: 6,
            lineDashStyle: [5, 5],
            color: '#000000'
        },
        10: {
            color: "#505050",
            type: "steppedArea",
            visibleInLegend: false,
            areaOpacity: 0,
            enableInteractivity: false,
            lineDashStyle: [2, 2, 20, 2, 20, 2]
        }
    };

    chart.draw(dataTable, options(series, 'Undersökningar samt medelvärde för ' + party));
    createTable(parties, ['date', 'Sifo', 'YouGov', 'Demoskop', 'Ipsos', 'Novus', 'SCB', 'Inizio', 'Sentio', 'Skop', 'Medelvärde', '']);
}

function createGraphAll(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'date');
    dataTable.addColumn('number', 'FI');
    dataTable.addColumn('number', 'V');
    dataTable.addColumn('number', 'S');
    dataTable.addColumn('number', 'MP');
    dataTable.addColumn('number', 'SD');
    dataTable.addColumn('number', 'C');
    dataTable.addColumn('number', 'L');
    dataTable.addColumn('number', 'M');
    dataTable.addColumn('number', 'KD');
    dataTable.addColumn('number', '');

    var allAvg = getAllAvg(data);
    dataTable.addRows(allAvg);

    var chart = new google.visualization.LineChart(document.getElementById('graphContainer'));

    var series = {
        0: {color: "#d24cd2"},
        1: {color: "#890505"},
        2: {color: "#fb0505"},
        3: {color: "#a2d06f"},
        4: {color: "#ffc405"},
        5: {color: "#058f3d"},
        6: {color: "#36c4f5"},
        7: {color: "#0574cd"},
        8: {color: "#052669"},
        9: {
            color: "#505050",
            type: "steppedArea",
            visibleInLegend: false,
            areaOpacity: 0,
            enableInteractivity: false,
            lineDashStyle: [2, 2, 20, 2, 20, 2]
        }
    };

    chart.draw(dataTable, options(series, 'Medelvärdet från samtliga institut'));
    createTable(allAvg, ['date', 'FI', 'V', 'S', 'MP', 'SD', 'C', 'L', 'M', 'KD', 'Medelvärde']);
}

function createGraphInstitute(data, institute) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'date');
    dataTable.addColumn('number', 'FI');
    dataTable.addColumn('number', 'V');
    dataTable.addColumn('number', 'S');
    dataTable.addColumn('number', 'MP');
    dataTable.addColumn('number', 'SD');
    dataTable.addColumn('number', 'C');
    dataTable.addColumn('number', 'L');
    dataTable.addColumn('number', 'M');
    dataTable.addColumn('number', 'KD');
    dataTable.addColumn('number', '');

    var institutes = getInstitue(data, institute);
    dataTable.addRows(institutes);

    var chart = new google.visualization.LineChart(document.getElementById('graphContainer'));

    var series = {
        0: {color: "#d24cd2"},
        1: {color: "#890505"},
        2: {color: "#fb0505"},
        3: {color: "#a2d06f"},
        4: {color: "#ffc405"},
        5: {color: "#058f3d"},
        6: {color: "#36c4f5"},
        7: {color: "#0574cd"},
        8: {color: "#052669"},
        9: {
            color: "#505050",
            type: "steppedArea",
            visibleInLegend: false,
            areaOpacity: 0,
            enableInteractivity: false,
            lineDashStyle: [2, 2, 20, 2, 20, 2]
        }
    };

    chart.draw(dataTable, options(series, 'Undersökningar från ' + institute));
    createTable(institutes, ['date', 'FI', 'V', 'S', 'MP', 'SD', 'C', 'L', 'M', 'KD', '']);

}

function options(series, title) {
    return {
        series: series,
        title: title,
        interpolateNulls: true,
        // explorer: {
        //     axis: 'horizontal',
        //     keepInBounds: true,
        //     maxZoomOut: 1
        //     //actions: ['dragToZoom', 'rightClickToReset']
        // },
        height: 500,
        width: '98%',
        serieType: 'line',
        lineWidth: 3,
        chartArea: {
            // leave room for y-axis labels
            width: '95%',
            height: '90%',
            left: 53,
            bottom: 10
        },

        vAxis: {
            viewWindow: {
                min: 0
            },
        },
        hAxis: {
            textPosition: 'none',
            gridlines: {
                color: 'transparent'
            }
        },
        legend: {
            position: 'top',
            alignment: 'start'
        },
        //curveType: 'function'
    };
}

function createTable(data, columns) {
    $("#myTable").remove();
    var table = $('<table id="myTable" class="table1">');
    var cols = data.length;
    var rows = data[0].length - 1;

    for (y = 0; y < rows; y++) {
        var tr = $('<tr>');
        for (x = 0; x < cols + 1; x++) {
            if (y === 0)
                $('<th>').appendTo(tr);
            else
                $('<td>').appendTo(tr);
        }
        table.append(tr);
    }
    var t = table[0];
    for (i = 1; i < columns.length - 1; i++) {
        $(t.rows[i].cells[0]).html(columns[i]);
        if (columns[i].toLowerCase() === "medelvärde") {
            $(t.rows[i].cells[0]).parent().css({"font-weight": "bold"});
        }
    }

    for (y = 0; y < rows; y++) {
        for (x = 0; x < cols; x++) {
            if (y === 0) {
                var year = data[x][y].split(' ')[1];
                var month = data[x][y].split(' ')[0];
                year = year.substring(2, 4);
                $(t.rows[y].cells[x + 1]).html(month + " " + year);
            } else {
                $(t.rows[y].cells[x + 1]).html(data[x][y]);
            }
        }
    }
    $("#tableContainer").append(table);
}

function getParty(data, party) {
    if (!avgRes) {
        data = groupData(data);
        avgRes = getAvgEachCompany(data);
    }
    data = sortAvgPartyEachMonth(avgRes, party);
    data = getPage(data);
    data = convertToArrayParty(data);
    return data;
}

function getAllAvg(data) {
    if (!avgRes) {
        data = groupData(data);
        avgRes = getAvgEachCompany(data);
    }
    data = sortAvgEachMonth(avgRes);
    data = getPage(data);
    data = convertToArray(data);
    return data;
}

function getInstitue(data, institute) {
    if (!avgRes) {
        data = groupData(data);
        avgRes = getAvgEachCompany(data);
    }
    data = sortAvgInstituteEachMonth(avgRes, institute);
    data = getPage(data);
    data = convertToArray(data);
    return data;
}

function groupData(data) {
    var allowedInstitutes = [
        'Sifo',
        'YouGov',
        'Demoskop',
        'Ipsos',
        'Novus',
        'SCB',
        'Inizio',
        'Sentio',
        'Skop'
    ];
    var grouped = {};
    $.map(data, function (row) {
        if (allowedInstitutes.indexOf(row.house) >= 0) {
            if (row.PublYearMonth in grouped) {
                let r = getObjects(grouped[row.PublYearMonth], 'company', row.house);
                if (r.length > 0) {
                    r = r[0];
                    r.m.push(Number(row.M));
                    r.l.push(Number(row.L));
                    r.c.push(Number(row.C));
                    r.kd.push(Number(row.KD));
                    r.s.push(Number(row.S));
                    r.v.push(Number(row.V));
                    r.mp.push(Number(row.MP));
                    r.sd.push(Number(row.SD));
                    r.fi.push(Number(row.FI));
                } else {
                    grouped[row.PublYearMonth].push({
                        company: row.house,
                        m: [Number(row.M)],
                        l: [Number(row.L)],
                        c: [Number(row.C)],
                        kd: [Number(row.KD)],
                        s: [Number(row.S)],
                        v: [Number(row.V)],
                        mp: [Number(row.MP)],
                        sd: [Number(row.SD)],
                        fi: [Number(row.FI)]
                    });
                }
            } else {
                grouped[row.PublYearMonth] = [
                    {
                        company: row.house,
                        m: [Number(row.M)],
                        l: [Number(row.L)],
                        c: [Number(row.C)],
                        kd: [Number(row.KD)],
                        s: [Number(row.S)],
                        v: [Number(row.V)],
                        mp: [Number(row.MP)],
                        sd: [Number(row.SD)],
                        fi: [Number(row.FI)]
                    }
                ];
            }
        }
    });
    return grouped;
}

function getAvgEachCompany(data) {
    $.map(data, function (row) {
        $.map(row, function (c) {
            c.m = avg(c.m);
            c.l = avg(c.l);
            c.c = avg(c.c);
            c.kd = avg(c.kd);
            c.s = avg(c.s);
            c.v = avg(c.v);
            c.mp = avg(c.mp);
            c.sd = avg(c.sd);
            c.fi = avg(c.fi);
        });
    });
    return data;
}

function sortAvgInstituteEachMonth(data, institute) {
    var sortedAvg = [];
    var keys = Object.keys(data, 0);
    $.map(keys, function (key) {
        var groupMonth = {};
        $.map(data[key], function (row) {
            if (row.company.toLowerCase().includes(institute.toLowerCase())) {
                addArray(groupMonth, 'm', row.m);
                addArray(groupMonth, 'l', row.l);
                addArray(groupMonth, 'c', row.c);
                addArray(groupMonth, 'kd', row.kd);
                addArray(groupMonth, 's', row.s);
                addArray(groupMonth, 'v', row.v);
                addArray(groupMonth, 'mp', row.mp);
                addArray(groupMonth, 'sd', row.sd);
                addArray(groupMonth, 'fi', row.fi);
            }
        });
        groupMonth.m = avg(groupMonth.m ? groupMonth.m : []);
        groupMonth.l = avg(groupMonth.l ? groupMonth.l : []);
        groupMonth.c = avg(groupMonth.c ? groupMonth.c : []);
        groupMonth.kd = avg(groupMonth.kd ? groupMonth.kd : []);
        groupMonth.s = avg(groupMonth.s ? groupMonth.s : []);
        groupMonth.v = avg(groupMonth.v ? groupMonth.v : []);
        groupMonth.mp = avg(groupMonth.mp ? groupMonth.mp : []);
        groupMonth.sd = avg(groupMonth.sd ? groupMonth.sd : []);
        groupMonth.fi = avg(groupMonth.fi ? groupMonth.fi : []);
        groupMonth['date'] = key;
        sortedAvg.push(groupMonth);
    });
    return sortedAvg;
}

function sortAvgPartyEachMonth(data, party) {
    var sortedAvg = [];
    var keys = Object.keys(data, 0);
    $.map(keys, function (key) {
        var groupMonth = {};
        $.map(data[key], function (row) {
            if (party.toLowerCase() === 'fi')
                addArray(groupMonth, row.company, row.fi);
            if (party.toLowerCase() === 'v')
                addArray(groupMonth, row.company, row.v);
            if (party.toLowerCase() === 's')
                addArray(groupMonth, row.company, row.s);
            if (party.toLowerCase() === 'mp')
                addArray(groupMonth, row.company, row.mp);
            if (party.toLowerCase() === 'sd')
                addArray(groupMonth, row.company, row.sd);
            if (party.toLowerCase() === 'c')
                addArray(groupMonth, row.company, row.c);
            if (party.toLowerCase() === 'l')
                addArray(groupMonth, row.company, row.l);
            if (party.toLowerCase() === 'm')
                addArray(groupMonth, row.company, row.m);
            if (party.toLowerCase() === 'kd')
                addArray(groupMonth, row.company, row.kd);
        });

        groupMonth.Sifo = avg(groupMonth.Sifo ? groupMonth.Sifo : []);
        groupMonth.YouGov = avg(groupMonth.YouGov ? groupMonth.YouGov : []);
        groupMonth.Demoskop = avg(groupMonth.Demoskop ? groupMonth.Demoskop : []);
        groupMonth.Ipsos = avg(groupMonth.Ipsos ? groupMonth.Ipsos : []);
        groupMonth.Novus = avg(groupMonth.Novus ? groupMonth.Novus : []);
        groupMonth.SCB = avg(groupMonth.SCB ? groupMonth.SCB : []);
        groupMonth.Inizio = avg(groupMonth.Inizio ? groupMonth.Inizio : []);
        groupMonth.Sentio = avg(groupMonth.Sentio ? groupMonth.Sentio : []);
        groupMonth.Skop = avg(groupMonth.Skop ? groupMonth.Skop : []);
        groupMonth['medel'] = getAvgParty(groupMonth);
        groupMonth['date'] = key;
        sortedAvg.push(groupMonth);
    });
    return sortedAvg;
}

function getAvgParty(data) {
    var array = [];
    if (data.Sifo)
        array.push(data.Sifo);
    if (data.YouGov)
        array.push(data.YouGov);
    if (data.Demoskop)
        array.push(data.Demoskop);
    if (data.Ipsos)
        array.push(data.Ipsos);
    if (data.Novus)
        array.push(data.Novus);
    if (data.SCB)
        array.push(data.SCB);
    if (data.Inizio)
        array.push(data.Inizio);
    if (data.Sentio)
        array.push(data.Sentio);
    if (data.Skop)
        array.push(data.Skop);

    return avg(array);
}

function sortAvgEachMonth(data) {
    var sortedAvg = [];
    var keys = Object.keys(data, 0);
    $.map(keys, function (key) {

        var groupMonth = {};
        $.map(data[key], function (row) {
            addArray(groupMonth, 'm', row.m);
            addArray(groupMonth, 'l', row.l);
            addArray(groupMonth, 'c', row.c);
            addArray(groupMonth, 'kd', row.kd);
            addArray(groupMonth, 's', row.s);
            addArray(groupMonth, 'v', row.v);
            addArray(groupMonth, 'mp', row.mp);
            addArray(groupMonth, 'sd', row.sd);
            addArray(groupMonth, 'fi', row.fi);
        });

        groupMonth.m = avg(groupMonth.m);
        groupMonth.l = avg(groupMonth.l);
        groupMonth.c = avg(groupMonth.c);
        groupMonth.kd = avg(groupMonth.kd);
        groupMonth.s = avg(groupMonth.s);
        groupMonth.v = avg(groupMonth.v);
        groupMonth.mp = avg(groupMonth.mp);
        groupMonth.sd = avg(groupMonth.sd);
        groupMonth.fi = avg(groupMonth.fi);
        groupMonth['date'] = key;
        sortedAvg.push(groupMonth);
    });

    return sortedAvg;
}

function convertToArray(data) {
    var array = [];
    $.map(data, function (d) {
        // var exists = d.fi || d.v || d.s || d.mp || d.sd || d.c || d.l || d.m || d.kd;
        // if (exists) {
        array.push([
            convertDate(d.date),
            round(d.fi),
            round(d.v),
            round(d.s),
            round(d.mp),
            round(d.sd),
            round(d.c),
            round(d.l),
            round(d.m),
            round(d.kd),
            4
        ]);
        // }
    });
    return array.reverse();
}

function convertToArrayParty(data) {
    var array = [];
    $.map(data, function (d) {
        // var exists = d.Sifo || d.YouGov || d.Demoskop || d.Ipsos || d.Novus || d.SCB || d.Inizio || d.Sentio || d.Skop;
        // if (exists) {
        array.push([
            convertDate(d.date),
            round(d.Sifo),
            round(d.YouGov),
            round(d.Demoskop),
            round(d.Ipsos),
            round(d.Novus),
            round(d.SCB),
            round(d.Inizio),
            round(d.Sentio),
            round(d.Skop),
            round(d.medel),
            4
        ])
        // }
    });
    return array.reverse();
}

function round(value, precision = 1) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function convertDate(dateString) {
    var year = dateString.split('-')[0];
    var monthString = dateString.split('-')[1];
    var month = convertMonthStringToNumber(monthString);
    return monthString + " " + year; // new Date(year + "-" + month + "-01");
}

function convertMonthStringToNumber(monthString) {
    if (monthString === 'jan')
        return 1;
    else if (monthString === 'feb')
        return 2;
    else if (monthString === 'mar')
        return 3;
    else if (monthString === 'apr')
        return 4;
    else if (monthString === 'maj')
        return 5;
    else if (monthString === 'jun')
        return 6;
    else if (monthString === 'jul')
        return 7;
    else if (monthString === 'aug')
        return 8;
    else if (monthString === 'sep')
        return 9;
    else if (monthString === 'okt')
        return 10;
    else if (monthString === 'nov')
        return 11;
    else
        return 12;
}

function convertmonthNumberToString(month) {
    if (month === 1)
        return 'januari';
    else if (month === 2)
        return 'februari';
    else if (month === 3)
        return 'mars';
    else if (month === 4)
        return 'april';
    else if (month === 5)
        return 'maj';
    else if (month === 6)
        return 'juni';
    else if (month === 7)
        return 'juli';
    else if (month === 8)
        return 'augusti';
    else if (month === 9)
        return 'september';
    else if (month === 10)
        return 'oktober';
    else if (month === 11)
        return 'november';
    else
        return 'december';
}

function convertShortMonthString(month){
    return convertmonthNumberToString(month).substring(0, 3);
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function avg(array) {
    if (array.length <= 0)
        return NaN;
    var avg = array.reduce(function (a, b) {
        return numOr0(a) + numOr0(b);
    });
    return avg / array.filter(Boolean).length;
}

function numOr0(n) {
    return isNaN(n) ? 0 : n;
}

function addArray(array, key, value) {
    if (key in array)
        array[key].push(value);
    else
        array[key] = [value];
}

function drawColumnChartValresultat() {
    var data = google.visualization.arrayToDataTable([
        ["Parti", "Resultat", {role: "style"}],
        ["Fi", 0.4, "color: #d24cd2"],
        ["V", 7.9, "color: #890505"],
        ["S", 28.4, "color: #fb0505"],
        ["MP", 4.3, "color: #a2d06f"],
        ["SD", 17.6, "color: #ffc405"],
        ["C", 8.6, "color: #058f3d"],
        ["L", 5.5, "color: #36c4f5"],
        ["M", 19.8, "color: #0574cd"],
        ["KD", 6.4, "color: #052669"],
        ["Övrigt", 1.0, "color: #000000"]
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
        {
            calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"
        },
        2]);

    var options = {
        title: "Preliminär valresultat 2018",
        chartArea: {
            // leave room for y-axis labels
            width: '100%',
            height: '60%'
        },
        width: 350,
        height: 120,
        bar: {groupWidth: "95%"},
        legend: {position: "none"},
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_valresultat"));
    chart.draw(view, options);
}

function drawComboChartNuvarandeManadAvg(data) {
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;

    var thisMonthResult = $.map(data, function (row) {
        var year = Number(row.PublYearMonth.split('-')[0]);
        var month = convertMonthStringToNumber(row.PublYearMonth.split('-')[1]);
        if (year === nowYear && month === nowMonth)
            return row;
    });

    data = groupData(thisMonthResult);
    data = getAvgEachCompany(data);
    data = sortAvgEachMonth(data);
    $.map(data, function (d) {
        data = [
            ["Parti", "Medelvärde", {role: "style"}],
            ["Fi", round(d.fi), "color: #d24cd2"],
            ["V", round(d.v), "color: #890505"],
            ["S", round(d.s), "color: #fb0505"],
            ["MP", round(d.mp), "color: #a2d06f"],
            ["SD", round(d.sd), "color: #ffc405"],
            ["C", round(d.c), "color: #058f3d"],
            ["L", round(d.l), "color: #36c4f5"],
            ["M", round(d.m), "color: #0574cd"],
            ["KD", round(d.kd), "color: #052669"]
        ];
    });

    data = google.visualization.arrayToDataTable(data);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
        {
            calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"
        },
        2]);

    var options = {
        title: 'Nuvarande opinionläge ' + convertmonthNumberToString(nowMonth) + ' månad',
        seriesType: 'bars',
        legend: {
            position: 'none'
        },
        bar: {groupWidth: "80%"},
        chartArea: {
            // leave room for y-axis labels
            width: '92%',
            height: '80%'
        },
        width: '100%',
        height: 500
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('combochart_nuvarande'));

    chart.draw(view, options);
}

function getHistory(data) {
    var historyList = [];
    $.each(data, function (i) {
        if (historyList.length > 5) {
            return false;
        }
        historyList.push({
            date: data[i].PublDate,
            institute: data[i].house
        });
    });

    $("#historyTable").empty();
    $("#historyTable").append($('<h3 id="historyLabel" class="span-col-2"><a href="history.html">Historik</a></h3>'));
    $.each(historyList, function (i, row) {
        $("#historyTable").append($('<span>' + row.date + '</span><span>' + row.institute + '</span>'));
    });
    $("#historyTable").append($('<h3 id="historySource" class="span-col-2">Källa <a href="https://github.com/hjnilsson/SwedishPolls">SwedishPolls</a></h3>'));

}

function getPage(data) {
    var sizeInt = 46;
    if (size === 'small') {
        sizeInt = 20;
    } else if (size === 'medium') {
        sizeInt = 28;
    } else if (size === 'large') {
        sizeInt = 38;
    }

    if (pageIndex <= 0) {
        pageIndex = 0;
        $('.btn-right').prop('disabled', true);
    } else {
        $('.btn-right').prop('disabled', false);
    }

    var from = pageIndex * sizeInt;
    var to = pageIndex * sizeInt + sizeInt;

    if (from + sizeInt >= data.length) {
        $('.btn-left').prop('disabled', true);
    } else {
        $('.btn-left').prop('disabled', false);
    }

    return data.slice(pageIndex * sizeInt, pageIndex * sizeInt + sizeInt);
}
