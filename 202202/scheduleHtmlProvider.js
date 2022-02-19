// Schedule Provider Main Function
async function scheduleHtmlProvider(dom = document) {
    /* Load AiSchedule Tools
     *   Tool usage can be found at 
     *     https://open-schedule-prod.ai.xiaomi.com/docs/#/help/?id=aischeduletools
     *   Tool source code can be found at
     *     https://open-schedule-prod.ai.xiaomi.com/docs/#/assets/AIScheduleTools
     * Lot thanks for the tool developer!
     */
    await loadTool('AIScheduleTools');

    // Detect whether the user is on the specified page
    var titleElement = scanForSingleElement("div", "divTitle", "element");
    // Check divTitle's innerText in order to comfirm the page is the target page or not
    if (titleElement == false || checkFrmSrc(titleElement) == false) {
        // User is not on the specified page
        console.log("User is not at the specified page! Stop the function");
        await AIScheduleAlert("请您在选项卡\"教学安排\"下执行导入操作");
        return "do not continue";
    }
    // User is on the specified page, clear to Proceed
    console.log("User is at the specified page. Clear to continue");

    // Now user is on the specified page, get the schedule table
    var timeTable = scanForSingleElement("table", "mytable", "element");
    // Check if the function is found the table or not
    if (timeTable) {
        // Target table is found!
        console.log("User class schedule table found! Return the string")
        await AIScheduleAlert({
            titleText: "提示",
            contentText: "如果课程存在冲突，程序会自动排除部分课程，且不会出现错误提示。\n请在导入后自行确定课表完整性。",
            confirmText: "好的"
        })
        return timeTable.parentElement.innerHTML;
    }

    // The function can't found the target table! Unknow error.
    console.log("Provide Unknow Error");
    return "do not continue";
}

/* This function is used to search for an element from all frames and all iframes
 * Parameter Description
 *   tag:    <String> Target element tag
 *   id:     <String> Target element id
 *   method: <String> Return data type
 *           "bool" Return a bool value means the element is exists or not
 *           "element" Return a element if the element is exists, otherwise will return false
 *           other Return a json if exists
 *   dom:    <Document> Where to search
 * Return Data
 *   You can see at the method parameter above
 */
function scanForSingleElement(tag, id, method = "bool", dom = document) {
    // Check is there a target element in this document
    var result = checkForSingleElement(tag, id, dom);
    // Return data with requested type
    if (result) {
        if (method == "bool") {
            return result["bool"];
        } else if (method == "element") {
            return result["element"];
        } else {
            return result;
        }
    }

    // Get all iframes and all frames in this document
    var ifrs = dom.getElementsByTagName("iframe");
    var frs = dom.getElementsByTagName("frame");

    // Recursive retrieval for all frames and all iframes
    if (frs.length) {
        for (let i = 0; i < frs.length; i++) {
            // Get content document of the frame
            var dom = frs[i].contentDocument.body.parentElement;
            // Recursive
            result = scanForSingleElement(tag, id, method, dom);
            // Return if found
            if (result) {
                return result;
            }
        }
    }
    if (ifrs.length) {
        for (let i = 0; i < ifrs.length; i++) {
            // Get content document of the iframe
            var dom = ifrs[i].contentWindow.document;
            // Recursive
            result = scanForSingleElement(tag, id, method, dom);
            // Return if found
            if (result) {
                return result;
            }
        }
    }
    // Target element not found!
    return false;
}

/* This function can search for specify element
 * Parameter Description
 *   tag: <String> Target element tag name
 *   id:  <String> Target element ID
 *   dom: <document> Document where to search
 * Return Data
 *   <JSON Data>
 */
function checkForSingleElement(tag, id, dom = document) {
    // Get all element in this document which have the target tag
    var elements = dom.getElementsByTagName(tag);
    if (elements.length) {
        // Check them one by one to match the target id
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("id") == id) {
                // If found
                console.log("Element Found.\nTag: " + tag + "\nID: " + elements[i].getAttribute("id"));
                return {
                    "bool": true,           // Is the target found or not
                    "element": elements[i]  // Target element
                };
            }
        }
    }
    // Target not found
    return false;
}

/* Check the title is the target title or not
 * This function need a element
 *   Tag: div
 *   ID:  divTitle
 */
function checkFrmSrc(element) {
    var targetSrc = "教学安排表";
    if (element.innerText == targetSrc) {
        return true;
    }
    return false;
}