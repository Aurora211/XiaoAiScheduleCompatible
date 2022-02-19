async function scheduleTimer({
    providerRes,
    parserRes
} = {}) {
    await loadTool('AIScheduleTools');
    await AIScheduleAlert("接下来程序将尝试从开发者的Github获取最新时间表，请稍等。\n超时后自动使用开发者内置时间表。");
    var timeTable = await fetchTimeTable("https://aurora211.github.io/XiaoAiScheduleCompatible/time.json");
    if (timeTable == false) {
        timeTable = builtInSchedule();
    }
    var mode = await AIScheduleConfirm({
        titleText: "是否使用程序时间表",
        contentText: "最近更新时间：\n" + timeTable["lastUpdate"] + "\n来源学院：\n" + timeTable["college"] + "\n数据来源:\n" + timeTable["from"],
        cancelText: "不使用",
        confirmText: "使用"
    })
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
        return false;
    }
}

function builtInSchedule() {
    return {
        "lastUpdate": "2022年02月20日",
        "college": "软件与物联网工程学院",
        "from": "Built-in",
        "forenoon": 5,
        "afternoon": 4,
        "night": 3,
        "sections": [
            {
                "section": 1,
                "startTime": "08:00",
                "endTime": "08:45"
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