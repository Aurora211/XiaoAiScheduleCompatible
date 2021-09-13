function scheduleHtmlParser(html) {
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9

    var ht = html.replace(/\<br\>/g, "\|=====\|");
    const $ = cheerio.load(ht,{decodeEntities:false});

    const table = $("#mytable").first();

    let result = [];

    var trs = $(table).children("tbody").children("tr").not(".H");
    var trslength = trs.length;

    for (var i = 0; i < trslength; i++) {
        var tds = $(trs[i]).children("td").not(".td1");
        var tdslength = tds.length;
        for (var day = 0; day < tdslength; day++) {
            var divs = $(tds[day]).children("div").not(".div_nokb");
            var divslength = divs.length;
            if (divslength < 1) {
                continue;
            }
            for (var j = 0; j < divslength; j++) {
                var cls = divs[j];
                var re = {weeks:[],sections:[]};
                re.name = $(cls).children("font").text();
                re.day = day + 1;
                var infos = $(cls).text().split("=====");
                re.teacher = infos[1].replace(/[\| ]+/g,"");
                var sect = infos[2].replace(/[\| ]+/g,"").match(/\[[0-9\-]+\]/g)[0].replace(/[\[\]]+/g,"").split("-");
                if (sect.length == 1) {
                    re.sections.push({section: parseInt(sect[0])});
                } else {
                    for (var k = parseInt(sect[0]); k <= parseInt(sect[1]); k++) {
                        re.sections.push({section: k});
                    }
                }
                var week = infos[2].replace(/[\| ]+/g,"").replace(/\[[0-9\-]+\]/g,"").split(",");
                var weeklength = week.length;
                for (var k = 0; k < weeklength; k++) {
                    var we = week[k].replace(/[单双]+/g,"").split("-");
                    if (we.length == 1) {
                        re.weeks.push(parseInt(we[0]));
                        continue;
                    }
                    we[0] = parseInt(we[0]);
                    we[1] = parseInt(we[1]);
                    var mode = 0;
                    if (week[k].indexOf("单") != -1) {
                        mode = 1;
                    }
                    if (week[k].indexOf("双") != -1) {
                        mode = 2;
                    }
                    var sta = we[0] - 1;
                    while (sta < we[1]) {
                        sta = sta + 1;
                        if (mode == 1 && sta % 2 == 0) {
                            continue;
                        }
                        if (mode == 2 && sta % 2 == 1) {
                            continue;
                        }
                        re.weeks.push(sta);
                    }
                }
                re.position = infos[3].replace(/[\| ]+/g,"");
                result.push(re);
                //console.log(re);
            }
        }
    }
    //console.log(result);
    return {courseInfos: result, sectionTimes: timeTableGenerator()};
}

function timeTableGenerator() {
    var result =[
        {
            section: 1,
            startTime: "08:00",
            endTime: "08:45"
        },
        {
            section: 2,
            startTime: "08:50",
            endTime: "09:35"
        },
        {
            section: 3,
            startTime: "09:55",
            endTime: "10:40"
        },
        {
            section: 4,
            startTime: "10:45",
            endTime: "11:30"
        },
        {
            section: 5,
            startTime: "11:35",
            endTime: "12:20"
        },
        {
            section: 6,
            startTime: "14:00",
            endTime: "14:45"
        },
        {
            section: 7,
            startTime: "14:50",
            endTime: "15:35"
        },
        {
            section: 8,
            startTime: "15:55",
            endTime: "16:40"
        },
        {
            section: 9,
            startTime: "16:45",
            endTime: "17:30"
        },
        {
            section: 10,
            startTime: "18:40",
            endTime: "19:25"
        },
        {
            section: 11,
            startTime: "19:30",
            endTime: "20:15"
        },
        {
            section: 12,
            startTime: "20:20",
            endTime: "21:05"
        }
    ];
    return result;
}