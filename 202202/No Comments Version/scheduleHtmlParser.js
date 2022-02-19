function scheduleHtmlParser(html) {
    var html = html.replace(/[\t\n]/g, "");
    var html = html.replace(/\<!--[a-zA-Z0-9\<\>\/\ \=\"]+--\>/g, "");
    var html = html.replace(/\<br\>/g, "\|==\|\|==\|");
    const $ = cheerio.load(html, { decodeEntities: false });
    const table = $("#mytable").first();
    const tbody = $(table).children("tbody");
    var result = [];
    const tr = $(tbody).children("tr").not(".H");
    for (var trIndex = 0; trIndex < tr.length; trIndex++) {
        var td = $(tr[trIndex]).children("td").not(".td1");
        for (var day = 0; day < td.length; day++) {
            var div = $(td[day]).children("div").not(".div_nokb");
            if (div.length < 1) {
                continue;
            }
            for (var courseIndex = 0; courseIndex < div.length; courseIndex++) {
                var info = { weeks: [], sections: [] };
                info.name = $(div[courseIndex]).children("font").first().text();
                var str = $(div[courseIndex]).text().split("\|==\|\|==\|");
                if (str.length != 4) {
                    continue;
                }
                info.teacher = str[1];
                info.position = str[3];
                info.day = day + 1;
                var section = str[2].match(/\[[0-9\-]+\]/g)
                if (section.length != 1) {
                    continue;
                }
                section = section[0].replace(/[\[\]]+/g, "").split("-");
                if (section.length == 1) {
                    info.sections.push(parseInt(section[0]));
                } else if (section.length == 2) {
                    info.sections = getSequence(parseInt(section[0]), parseInt(section[1]));
                } else {
                    continue;
                }
                var week = str[2].replace(/\[[0-9\-]+\]/g, "").split(',');
                for (var i = 0; i < week.length; i++) {
                    var we = week[i].match(/[0-9\-]+/g)[0].split("-");
                    var mode = 0;
                    if (week[i].indexOf("µ¥") != -1) {
                        mode = 1;
                    } else if (week[i].indexOf("Ë«") != -1) {
                        mode = 2;
                    }
                    info.weeks = info.weeks.concat(getSequence(parseInt(we[0]), parseInt(we[1]), mode));
                }
                result.push(info);
            }
        }
    }
    result = conflictDetect(result);
    return result;
}

function getSequence(start, end, mode = 0) {
    var result = [];
    for (var i = start; i <= end; i++) {
        if (mode == 1 && i % 2 == 0) {
            continue;
        } else if (mode == 2 && i % 2 == 1) {
            continue;
        }
        result.push(i);
    }
    return result;
}

function conflictDetect(jsonArray) {
    for (var courseIndex = 0; courseIndex < jsonArray.length; courseIndex++) {
        var source = jsonArray[courseIndex];
        for (var i = courseIndex + 1; i < jsonArray.length; i++) {
            var target = jsonArray[i];
            if (dayConflictDetect(source, target)) {
                var course = jsonArray.splice(i, 1);
                i = i - 1;
            }
        }
    }
    return jsonArray;
}

function dayConflictDetect(source, target) {
    var result = false;
    if (source.day == target.day) {
        result = sectionConflictDetect(source, target);
    }
    return result;
}
function sectionConflictDetect(source, target) {
    var sourceSection = source.sections;
    var targetSection = target.sections;
    for (var i = 0; i < sourceSection.length; i++) {
        var result = false
        if (targetSection.indexOf(sourceSection[i]) != -1) {
            result = weekConflictDetect(source, target);
        }
        if (result) {
            return result;
        }
    }
    return false;
}
function weekConflictDetect(source, target) {
    var sourceWeek = source.weeks;
    var targetWeek = target.weeks;
    for (var i = 0; i < sourceWeek.length; i++) {
        if (targetWeek.indexOf(sourceWeek[i]) != -1) {
            return true;
        }
    }
    return false;
}