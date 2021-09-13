/* ================================================
 * This script is written by Aurora211.
 * This script is a compatible script for XiaoAi XiaoMi to get schedule from JiangXi Univercity of Finance and Economics's system.
 * 
 * Update Time: 2021/09/05
 * Github Site: https://aurora211.github.io/XiaoAiSchedule
*/

function scheduleHtmlProvider(dom = document, mode = 0) {
    // Pop out alert window to tell user about the script
    if (mode == 0) { // Check if this is the first time to run this function.
        alert("欢迎使用小爱课程表“江西财经大学”教务适配。\r\n\r\n请确保您已经在“主控界面”=>“教学安排”选项卡内。如果您已经在此选项卡，请忽略该提示。\r\n\r\n适配版本：2.0.0\r\n课表时间以“软件与物联网工程学院”为准\r\n时刻表更新时间：2021/09/05 18:30");
    }

    const ifrs = dom.getElementsByTagName("iframe");
    const frs = dom.getElementsByTagName("frame");
    var result = "";

    if (frs.length) {
        for (let i = 0; i < frs.length; i++) {
            const dom = frs[i].contentDocument.body.parentElement;
            result += scheduleHtmlProvider(dom, 1);
        }
    }
    if (ifrs.length) {
        for (let i = 0; i < ifrs.length; i++) {
            const dom = ifrs[i].contentWindow.document;
            result += scheduleHtmlProvider(dom, 1);
        }
    }
    if(!ifrs.length && !frs.length){
        var tables =  dom.getElementsByTagName("table");
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            if (table.getAttribute("id") == "mytable") {
                return tables[i].parentElement.innerHTML;
            }
        }
    }
    return result;
}