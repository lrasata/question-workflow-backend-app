import isNil from "lodash/isNil";
import {sanitize} from "./sanitization/sanitize";

// Copied from : node_modules/@strapi/content-manager/dist/server/index.js
// it is copied from content manager code to not introduce regression regarding middleware configuration
// this code is duplicated because this middleware is not natively exported
// CODE START
const routing = (async (ctx, next)=>{
    const { model } = ctx.params;
    const ct = strapi.contentTypes[model];
    if (!ct) {
        return ctx.send({
            error: 'contentType.notFound'
        }, 404);
    }
    let controllers;
    if (!ct.plugin || ct.plugin === 'admin') {
        controllers = strapi.admin.controllers;
    } else {
        controllers = strapi.plugin(ct.plugin).controllers;
    }
    const { route } = ctx.state;
    if (typeof route.handler !== 'string') {
        return next();
    }
    const [, action] = route.handler.split('.');
    let actionConfig;
    if (!ct.plugin || ct.plugin === 'admin') {
        actionConfig = strapi.config.get(`admin.layout.${ct.modelName}.actions.${action}`);
    } else {
        actionConfig = strapi.plugin(ct.plugin).config(`layout.${ct.modelName}.actions.${action}`);
    }
    if (!isNil(actionConfig)) {
        const [controller, action] = actionConfig.split('.');
        if (controller && action) {
            return controllers[controller.toLowerCase()][action](ctx, next);
        }
    }
    await next();
});
// CODE END


const removeRouteByPath = (path: string, method: string, routeList) => {
    const findIndex = routeList.findIndex(route => route.path === path && route.method === method);
    findIndex !== -1 && routeList.splice(findIndex , 1)

    return routeList
}

module.exports = (plugin) => {

    const collectionTypeController = plugin.controllers['collection-types'];
    collectionTypeController.strapiCreate = collectionTypeController.create;
    collectionTypeController.sanitizeAndCreate = async (ctx) => {
        const ctxRequestBody = {...ctx.request.body};
        ctx.request.body = sanitize(ctxRequestBody);
        await collectionTypeController.strapiCreate(ctx);
    };

    collectionTypeController.strapiUpdate = collectionTypeController.update;
    collectionTypeController.sanitizeAndUpdate = async (ctx) => {
        const ctxRequestBody = {...ctx.request.body};
        ctx.request.body = sanitize(ctxRequestBody);
        await collectionTypeController.strapiUpdate(ctx);
    };

    collectionTypeController.strapiPublish = collectionTypeController.publish;
    collectionTypeController.sanitizeAndPublish = async (ctx) => {
        const ctxRequestBody = {...ctx.request.body};
        ctx.request.body = sanitize(ctxRequestBody);
        await collectionTypeController.strapiPublish(ctx);
    };


    const singleTypeController = plugin.controllers['single-types'];
    singleTypeController.strapiCreateOrUpdate = singleTypeController.createOrUpdate;
    singleTypeController.sanitizeAndCreateOrUpdate = async (ctx) => {
        const ctxRequestBody = {...ctx.request.body};
        ctx.request.body = sanitize(ctxRequestBody);
        await singleTypeController.strapiCreateOrUpdate(ctx);
    };

    singleTypeController.strapiPublish = singleTypeController.publish;
    singleTypeController.sanitizeAndPublish = async (ctx) => {
        const ctxRequestBody = {...ctx.request.body};
        ctx.request.body = sanitize(ctxRequestBody);
        await singleTypeController.strapiPublish(ctx);
    };


    const arrayToFilter = [...plugin.routes['admin'].routes];
    plugin.routes['admin'].routes = removeRouteByPath('/collection-types/:model', 'POST', arrayToFilter);
    plugin.routes['admin'].routes.push({
            method: 'POST',
            path: '/collection-types/:model',
            handler: 'collection-types.sanitizeAndCreate',
        config: {
            middlewares: [
                routing
            ],
            policies: [
                'admin::isAuthenticatedAdmin',
                {
                    name: 'plugin::content-manager.hasPermissions',
                    config: {
                        actions: [
                            'plugin::content-manager.explorer.create'
                        ]
                    }
                }
            ]
        }

    });

    plugin.routes['admin'].routes = removeRouteByPath('/collection-types/:model/:id', 'PUT', arrayToFilter);
    plugin.routes['admin'].routes.push({
        method: 'PUT',
        path: '/collection-types/:model/:id',
        handler: 'collection-types.sanitizeAndUpdate',
        config: {
            middlewares: [
                routing
            ],
            policies: [
                'admin::isAuthenticatedAdmin',
                {
                    name: 'plugin::content-manager.hasPermissions',
                    config: {
                        actions: [
                            'plugin::content-manager.explorer.update'
                        ]
                    }
                }
            ]
        }

    });

    plugin.routes['admin'].routes = removeRouteByPath('/collection-types/:model/:id/actions/publish', 'POST', arrayToFilter);
    plugin.routes['admin'].routes.push({
        method: 'POST',
        path: '/collection-types/:model/:id/actions/publish',
        handler: 'collection-types.sanitizeAndPublish',
        config: {
            middlewares: [
                routing
            ],
            policies: [
                'admin::isAuthenticatedAdmin',
                {
                    name: 'plugin::content-manager.hasPermissions',
                    config: {
                        actions: [
                            'plugin::content-manager.explorer.publish'
                        ]
                    }
                }
            ]
        }

    });

    plugin.routes['admin'].routes = removeRouteByPath('/single-types/:model', 'PUT', arrayToFilter);
    plugin.routes['admin'].routes.push({
        method: 'PUT',
        path: '/single-types/:model',
        handler: 'single-types.sanitizeAndCreateOrUpdate',
        config: {
            middlewares: [
                routing
            ],
            policies: [
                'admin::isAuthenticatedAdmin',
                {
                    name: 'plugin::content-manager.hasPermissions',
                    config: {
                        actions: [
                            'plugin::content-manager.explorer.create',
                            'plugin::content-manager.explorer.update'
                        ]
                    }
                }
            ]
        }

    });

    plugin.routes['admin'].routes = removeRouteByPath('/single-types/:model/actions/publish', 'POST', arrayToFilter);
    plugin.routes['admin'].routes.push({
        method: 'POST',
        path: '/single-types/:model/actions/publish',
        handler: 'single-types.sanitizeAndPublish',
        config: {
            middlewares: [
                routing
            ],
            policies: [
                'admin::isAuthenticatedAdmin',
                {
                    name: 'plugin::content-manager.hasPermissions',
                    config: {
                        actions: [
                            'plugin::content-manager.explorer.publish'
                        ]
                    }
                }
            ]
        }

    });

    return plugin;
};