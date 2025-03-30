
module.exports = (plugin) => {
    plugin.controllers.controllerA.find = (ctx) => {};

    plugin.routes['content-api'].routes.push({
        method: 'GET',
        path: '/route-path',
        handler: 'controller.action',
    });

    return plugin;
};