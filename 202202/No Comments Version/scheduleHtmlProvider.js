async function scheduleHtmlProvider(dom = document) {
    await loadTool('AIScheduleTools');
    var titleElement = scanForSingleElement("div", "divTitle", "element");
    if (titleElement == false || checkFrmSrc(titleElement) == false) {
        await AIScheduleAlert("请您在选项卡\"教学安排\"下执行导入操作");
        return "do not continue";
    }
    var timeTable = scanForSingleElement("table", "mytable", "element");
    if (timeTable) {
        await AIScheduleAlert({
            titleText: "提示",
            contentText: "如果课程存在冲突，程序会自动排除部分课程，且不会出现错误提示。\n请在导入后自行确定课表完整性。",
            confirmText: "好的"
        });
        await AIScheduleAlert("这可能是江财小爱适配的最后一个版本了，编写的同学可能没有时间和精力再继续下去了。\n如果有能力的同学可以通过Github联系开发者或继续维护本项目。\n项目地址：https://github.com/Aurora211/XiaoAiScheduleCompatible");
        return timeTable.parentElement.innerHTML;
    }
    return "do not continue";
}

function scanForSingleElement(tag, id, method = "bool", dom = document) {
    var result = checkForSingleElement(tag, id, dom);
    if (result) {
        if (method == "bool") {
            return result["bool"];
        } else if (method == "element") {
            return result["element"];
        } else {
            return result;
        }
    }
    var ifrs = dom.getElementsByTagName("iframe");
    var frs = dom.getElementsByTagName("frame");
    if (frs.length) {
        for (let i = 0; i < frs.length; i++) {
            var dom = frs[i].contentDocument.body.parentElement;
            result = scanForSingleElement(tag, id, method, dom);
            if (result) {
                return result;
            }
        }
    }
    if (ifrs.length) {
        for (let i = 0; i < ifrs.length; i++) {
            var dom = ifrs[i].contentWindow.document;
            result = scanForSingleElement(tag, id, method, dom);
            if (result) {
                return result;
            }
        }
    }
    return false;
}

function checkForSingleElement(tag, id, dom = document) {
    var elements = dom.getElementsByTagName(tag);
    if (elements.length) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("id") == id) {
                return {
                    "bool": true,
                    "element": elements[i]
                };
            }
        }
    }
    return false;
}

function checkFrmSrc(element) {
    var targetSrc = "教学安排表";
    if (element.innerText == targetSrc) {
        return true;
    }
    return false;
}