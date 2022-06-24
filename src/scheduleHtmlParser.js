// Main Html Parser Function
function scheduleHtmlParser(html) {
    // Process All Useless Chars
    var html = html.replace(/[\t\n]/g, ""); // Delete All '\t' and all '\n' Chars
    var html = html.replace(/\<!--[a-zA-Z0-9\<\>\/\ \=\"]+--\>/g, ""); // Delete All Comments
    var html = html.replace(/\<br\>/g, "\|==\|\|==\|"); // Replace All "<br>" Strings to Specified String
    //console.log(html);

    // Use cheerio to load html element with $
    const $ = cheerio.load(html, { decodeEntities: false });

    // Get the target element
    const table = $("#mytable").first();
    const tbody = $(table).children("tbody");
    //console.log($(tbody).html());

    // Initialization return value
    var result = [];

    // Start Parse ==============================

    // Get all table rows
    const tr = $(tbody).children("tr").not(".H");
    for (var trIndex = 0; trIndex < tr.length; trIndex++) {
        // Get all course cells in the row
        var td = $(tr[trIndex]).children("td").not(".td1");
        for (var day = 0; day < td.length; day++) {
            // Get all course in the cell
            var div = $(td[day]).children("div").not(".div_nokb");
            // Check is there any course in this cell
            if (div.length < 1) {
                // No course in the cell, go next cell
                continue;
            }
            // Process all course in the cell
            for (var courseIndex = 0; courseIndex < div.length; courseIndex++) {
                // Initialization course info value
                var info = { weeks: [], sections: [] };
                // Get course name
                info.name = $(div[courseIndex]).children("font").first().text();
                // Get specified info string
                var str = $(div[courseIndex]).text().split("\|==\|\|==\|");
                // Check format
                if (str.length != 4) {
                    // String format is not standard. Can't proceed, go next course
                    //console.log(info.name + "\nstr Format Error");
                    continue;
                }
                // Get course teacher
                info.teacher = str[1];
                // Get course classroom position
                info.position = str[3];
                // Get course day
                info.day = day + 1;
                // Extracting section time eigenvalues
                var section = str[2].match(/\[[0-9\-]+\]/g)
                // Check format
                if (section.length != 1) {
                    // String format is not standard. Can't proceed, go next course
                    //console.log(info.name + "\nsection Format Error");
                    continue;
                }
                // Split section string, get start section and end section
                section = section[0].replace(/[\[\]]+/g, "").split("-");
                // Resolve Different Situation
                if (section.length == 1) {
                    // Only one section
                    info.sections.push(parseInt(section[0]));
                } else if (section.length == 2) {
                    // Multiple sections
                    info.sections = getSequence(parseInt(section[0]), parseInt(section[1]));
                } else {
                    // String format is not standard. Can't proceed, go next course
                    //console.log(info.name + "\nsection sequence Format Error");
                    continue;
                }
                // Extracting section time eigenvalues
                var week = str[2].replace(/\[[0-9\-]+\]/g, "").split(','); // Prevent Multi Weeks String
                for (var i = 0; i < week.length; i++) {
                    // Process for each weeks string
                    var we = week[i].match(/[0-9\-]+/g)[0].split("-");
                    // Initialization week mode, default is all
                    var mode = 0;
                    if (week[i].indexOf("µ¥") != -1) {
                        // mode set to odd
                        mode = 1;
                    } else if (week[i].indexOf("Ë«") != -1) {
                        // mode set to even
                        mode = 2;
                    }
                    // Generate sequence and set course week info
                    info.weeks = info.weeks.concat(getSequence(parseInt(we[0]), parseInt(we[1]), mode));
                }
                //console.log(info);
                result.push(info);
                //console.log("Course Detected: " + info.name);
            }
        }
    }
    //console.log("Course Info All Loaded")
    //console.log(result);

    // Start Conflict Detection
    //console.log("Starting Conflict Detection");
    result = conflictDetect(result);

    // Return Requested JSON Data
    return result;
}

/* This function generate number sequence
 *  0   All     example:[1,2,3,4,5,6,7,8,9,10]
 *  1   Odd     example:[1,3,5,7,9]
 *  2   Even    example:[2,4,6,8,10]
 */
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

/* Course conflict detection
 * Need Parser's JSON Data
 */
function conflictDetect(jsonArray) {
    for (var courseIndex = 0; courseIndex < jsonArray.length; courseIndex++) {
        // Get source course info
        var source = jsonArray[courseIndex];
        //console.log("Checking Course No." + courseIndex + " - Named: " + source.name);
        for (var i = courseIndex + 1; i < jsonArray.length; i++) {
            // Get target course info
            var target = jsonArray[i];
            // Detect Confliction
            if (dayConflictDetect(source, target)) {
                // Confliction Detected. Delete target course
                var course = jsonArray.splice(i, 1);
                // Index shift
                i = i - 1;
                //console.log("Conflict Detected. Course Deleted. Named: " + course[0].name);
            }
        }
        //console.log("Conflict Detection Pass. Named: " + source.name);
    }
    // Return Sequence Without Confliction
    return jsonArray;
}

/* Following 3 Functions are Subfunction of Course conflict detection
 * Help Course conflict detection to solve problem
 */
function dayConflictDetect(source, target) {
    var result = false;
    // Check whether two course is at same day
    if (source.day == target.day) {
        result = sectionConflictDetect(source, target);
    }
    return result;
}
function sectionConflictDetect(source, target) {
    var sourceSection = source.sections;
    var targetSection = target.sections;
    // Check whether two course is at same section
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
    // Check whether two course is at same week
    for (var i = 0; i < sourceWeek.length; i++) {
        if (targetWeek.indexOf(sourceWeek[i]) != -1) {
            return true;
        }
    }
    return false;
}