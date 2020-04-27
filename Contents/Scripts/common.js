const INFO_ICON = 'font-awesome:fa-info-circle';

const HELP_LIST = [
    {title: 'Search by file name', badge: '[type:]<file-name>', icon: INFO_ICON},
    {title: 'Search by file content', badge: '[type]@<keyword>', icon: INFO_ICON},
    {title: 'Escape search scope', badge: 'Command + Enter', icon: INFO_ICON},
    {title: 'Available file types', badge: 'docs, pdf, image...', icon: INFO_ICON},
];


/**
 * Try parse a JSON string, or return the fallback value
 *
 * @param      {string}  value     The value
 * @param      {any}     fallback  The fallback
 * @return     {any}
 */
function tryParse(value, fallback) {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch(e) {/**/}
    }
    return fallback;
}
/**
 * Dump an object to LaunchBar output
 *
 * @param      {any}  value   The value
 * @return     {Array}
 */
function dump(value) {
    const items = [];
    if (value && typeof value === 'object') {
        Object.keys(value).forEach((key) => {
            const item = {
                title: key,
                icon: 'font-awesome:info-circle'
            };
            const asdadasd = tryParse(value[key], value[key]);
            if (typeof asdadasd === 'object' && asdadasd) {
                item.badge = Array.isArray(asdadasd) ? `${asdadasd.length} item` : 'Object'
                item.children = dump(asdadasd);
            } else {
                if (asdadasd) {
                    item.label = asdadasd.toString();
                    item.children = [{title: item.label}];
                } else {
                    item.badge = 'null';
                }
            }
            items.push(item);
        })
    }
    return items;
}


/**
 * Wait for given ms and check if can continue to proform things
 *
 * @param      {number}  [ms=1000]  The milliseconds
 * @return     {boolean}
 */
function throttle(ms = 1000) {
    const FILE = Action.cachePath + 'throttle';
    const time = Date.now();
    File.writeText(time.toString(), FILE);
    while (Date.now() - time < ms) {
        continue;
    }
    return time.toString() === File.readText(
        FILE
    );
}

