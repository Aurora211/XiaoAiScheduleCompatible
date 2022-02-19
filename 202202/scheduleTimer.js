/* Time set function
 *   Help user set time data
 * Coder's Online Time Table Site
 *   https://aurora211.github.io/XiaoAiScheduleCompatible/time.json
 * Return JSON Data (value below is just example)
 *   All data are optional and not required
 *   Return {} if you don't want to set anything
 * {
 *   "tatalWeek": <Integer> 20          // Total week count, value between [1,30]
 *   "startSemester": <String> ""       // School opening time, 13 bit long string, Code generation is recommended
 *   "startWithSunday": <Boolean> false // Is Sunday the starting date
 *   "showWeekend": <Boolean> false     // Show weekend
 *   "forenoon": <Integer> 1            // Number of courses in the morning, value between [1,10]
 *   "afternoon": <Integer> 1           // Number of courses in the afternoon, value between [0,10]
 *   "night": <Interger> 0              // Number of courses in the night, value between [0,10]
 *   "sections": [
 *      {
 *        "section": <Interger> 1       // Course section, value between [1,30]
 *        "startTime": <String> "08:00"  // Course start time, value must format like the example
 *        "endTime": <String> "08:50"   // Course end time, value must format like the example
 *      },
 *      {
 *        "section": <Interger> 2
 *        "startTime": <String> "08:55"
 *        "endTime": <String> "09:45"
 *      }
 *   ]
 * }
 */
async function scheduleTimer({
    providerRes,
    parserRes
} = {}) {
    /* Load AiSchedule Tools
     *   Tool usage can be found at 
     *     https://open-schedule-prod.ai.xiaomi.com/docs/#/help/?id=aischeduletools
     *   Tool source code can be found at
     *     https://open-schedule-prod.ai.xiaomi.com/docs/#/assets/AIScheduleTools
     * Lot thanks for the tool developer!
     */
    await loadTool('AIScheduleTools');

    // Fetch the time table data
    var timeTable = await fetchTimeTable("https://aurora211.github.io/XiaoAiScheduleCompatible/time.json");
    console.log(timeTable);
    // Check whether the fetch is successful
    if (timeTable == false) {
        // Fetch failed using built-in schedule
        console.log("Fetch failed to get schedule data");
        /*await AIScheduleAlert({
            titleText: "在线时间表错误",
            contentText: "无法获取在线时间表，正在使用内置时间表替代",
            confirmText: "好的"
        });*/
        timeTable = builtInSchedule();
    }

    // Ask the user if they follow the schedule
    var mode = await AIScheduleConfirm({
        titleText: "是否使用程序时间表",
        contentText: "最近更新时间：\n" + timeTable["lastUpdate"] + "\n来源学院：\n" + timeTable["college"] + "\n数据来源:\n" + timeTable["from"],
        cancelText: "不使用",
        confirmText: "使用"
    })
    // Decide whether to use the program schedule according to the user's choice
    if (mode) {
        return timeTable;
    } else {
        return {};
    }
}

async function fetchTimeTable(url) {
    await loadTool('AIScheduleTools');
    try {
        var res = await fetch(url);
        var timeTable = await res.json();
        return timeTable;
    } catch (error) {
        console.error("Fetch error: Can't able to get time table from online site.");
        return false;
    }
}

function builtInSchedule() {
    return {
        "lastUpdate": "2022年02月20日",
        "college": "软件与物联网工程学院",
        "from": "Built-in",
        //"tatalWeek": 20,          // Total week count, value between [1,30]
        //"startSemester": "",      // School opening time, 13 bit long string, Code generation is recommended
        //"startWithSunday": false, // Is Sunday the starting date
        //"showWeekend": true,      // Show weekend
        "forenoon": 5,            // Number of courses in the morning, value between [1,10]
        "afternoon": 4,           // Number of courses in the afternoon, value between [0,10]
        "night": 3,               // Number of courses in the night, value between [0,10]
        "sections": [
            {
                "section": 1,         // Course section, value between [1,30]
                "startTime": "08:00", // Course start time, value must format like the example
                "endTime": "08:45"    // Course end time, value must format like the example
            },
            {
                "section": 2,
                "startTime": "08:50",
                "endTime": "09:35"
            },
            {
                "section": 3,
                "startTime": "09:55",
                "endTime": "10:40"
            },
            {
                "section": 4,
                "startTime": "10:45",
                "endTime": "11:30"
            },
            {
                "section": 5,
                "startTime": "11:35",
                "endTime": "12:20"
            },
            {
                "section": 6,
                "startTime": "14:00",
                "endTime": "14:45"
            },
            {
                "section": 7,
                "startTime": "14:50",
                "endTime": "15:35"
            },
            {
                "section": 8,
                "startTime": "15:55",
                "endTime": "16:40"
            },
            {
                "section": 9,
                "startTime": "16:45",
                "endTime": "17:30"
            },
            {
                "section": 10,
                "startTime": "18:40",
                "endTime": "19:25"
            },
            {
                "section": 11,
                "startTime": "19:30",
                "endTime": "20:15"
            },
            {
                "section": 12,
                "startTime": "20:20",
                "endTime": "21:05"
            }
        ]
    }
}