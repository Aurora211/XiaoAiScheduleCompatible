async function scheduleTimer({
    providerRes,
    parserRes
} = {}) {
    await loadTool('AIScheduleTools');
    await AIScheduleAlert("���������򽫳��Դӿ����ߵ�Github��ȡ����ʱ������Եȡ�\n��ʱ���Զ�ʹ�ÿ���������ʱ���");
    var timeTable = await fetchTimeTable("https://aurora211.github.io/XiaoAiScheduleCompatible/time.json");
    if (timeTable == false) {
        timeTable = builtInSchedule();
    }
    var mode = await AIScheduleConfirm({
        titleText: "�Ƿ�ʹ�ó���ʱ���",
        contentText: "�������ʱ�䣺\n" + timeTable["lastUpdate"] + "\n��ԴѧԺ��\n" + timeTable["college"] + "\n������Դ:\n" + timeTable["from"],
        cancelText: "��ʹ��",
        confirmText: "ʹ��"
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
        "lastUpdate": "2022��02��20��",
        "college": "���������������ѧԺ",
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