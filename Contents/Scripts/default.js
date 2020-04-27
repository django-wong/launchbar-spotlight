// LaunchBar Action Script

include('common.js');

function run(argument) {
    if (typeof argument === 'undefined') {
        return [];
    }

    if (['?', '？'].indexOf(argument) !== -1) {
        return HELP_LIST;
    }

    const command = ['/usr/bin/mdfind'];

    let kind = null, name = argument, content = null, items = [];

    if (argument.indexOf(':') !== -1) {
        [kind, name] = argument.split(':');
    }

    if (argument.indexOf('@') !== -1) {
        [kind, content] = argument.split('@');
    }

    if (Action.preferences.scope && !LaunchBar.options.commandKey) {
        command.push('-onlyin', Action.preferences.scope);
    }

    if (kind) {
        command.push(`kind:${kind}`);
    }

    if (content) {
        command.push(content);
    } else if (name) {
        command.push('-name', name);
    } else {
        return [];
    }

    const result = LaunchBar.execute(...command);

    if (result) {
        items = result.trim().split('\n').map((path) => {
            return {
                title: File.displayName(path),
                path
            };
        });
    }

    if (items.length === 0) {
        items.push({title: 'No Results', icon: 'font-awesome:fa-smile-o'});
    }

    return items;
}



/**
 * Run this action with paths, ack user to set a search scope
 *
 * @param      {Array<string>}  paths   The paths
 * @return     {Array}
 */
function runWithPaths(paths) {
    const items = paths.filter(path => File.isDirectory(path)).map((path) => {
        return {
            action: 'setSearchScope',
            title: path,
            path: path + '/',
            actionArgument: path,
            icon: 'font-awesome:fa-folder-open-o'
        }
    });

    if (items.length === 0) {
        return [];
    }

    items.unshift(
        {title: '设置默认搜索范围', icon: 'font-awesome:fa-angle-down'}
    );

    return items;
}


/**
 * Sets the search scope.
 *
 * @param      {string}  path    The path
 * @return     {Array}
 */
function setSearchScope(path) {
    LaunchBar.log(`Set search scope to: ${path}`);
    Action.preferences.scope = path;
    return [
        {actionBundleIdentifier: Action.bundleIdentifier}
    ];
}

