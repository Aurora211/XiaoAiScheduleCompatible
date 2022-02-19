async function scheduleHtmlProvider(dom = document) {
    await loadTool('AIScheduleTools');
    var titleElement = scanForSingleElement("div", "divTitle", "element");
    if (titleElement == false || checkFrmSrc(titleElement) == false) {
        await AIScheduleAlert("������ѡ�\"��ѧ����\"��ִ�е������");
        return "do not continue";
    }
    var timeTable = scanForSingleElement("table", "mytable", "element");
    if (timeTable) {
        await AIScheduleAlert({
            titleText: "��ʾ",
            contentText: "����γ̴��ڳ�ͻ��������Զ��ų����ֿγ̣��Ҳ�����ִ�����ʾ��\n���ڵ��������ȷ���α������ԡ�",
            confirmText: "�õ�"
        });
        await AIScheduleAlert("������ǽ���С����������һ���汾�ˣ���д��ͬѧ����û��ʱ��;����ټ�����ȥ�ˡ�\n�����������ͬѧ����ͨ��Github��ϵ�����߻����ά������Ŀ��\n��Ŀ��ַ��https://github.com/Aurora211/XiaoAiScheduleCompatible");
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
    var targetSrc = "��ѧ���ű�";
    if (element.innerText == targetSrc) {
        return true;
    }
    return false;
}