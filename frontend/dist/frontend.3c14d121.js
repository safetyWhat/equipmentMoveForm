// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"n0fw4":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "5e0263af3c14d121";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"kTBnD":[function(require,module,exports,__globalThis) {
var _auth0SpaJs = require("@auth0/auth0-spa-js");
// Configuration
const CONFIG = {
    // Replace this with your Azure Function URL when deployed
    AZURE_FUNCTION_URL: 'http://localhost:7071/api/submitEquipmentMove',
    MAX_FILE_SIZE: 10485760,
    ALLOWED_FILE_TYPES: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
    ]
};
// DOM Elements
const form = document.getElementById('equipmentForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
// Form validation
function validateForm(formData) {
    const errors = [];
    // Check required fields
    if (!formData.get('userName').trim()) errors.push('Name is required');
    if (!formData.get('unitNumber').trim()) errors.push('Unit number is required');
    if (!formData.get('moveDate')) errors.push('Move date is required');
    if (!formData.get('equipmentHours') || formData.get('equipmentHours') < 0) errors.push('Valid equipment hours are required');
    // Validate files
    const files = formData.getAll('photos');
    if (files.length > 0) for (let file of files){
        if (file.size === 0) continue; // Skip empty files
        if (file.size > CONFIG.MAX_FILE_SIZE) errors.push(`File ${file.name} is too large. Maximum size is 10MB.`);
        if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) errors.push(`File ${file.name} is not a valid image format.`);
    }
    return errors;
}
// Convert files to base64
async function convertFilesToBase64(files) {
    const base64Files = [];
    for (let file of files){
        if (file.size === 0) continue; // Skip empty files
        try {
            const base64 = await new Promise((resolve, reject)=>{
                const reader = new FileReader();
                reader.onload = ()=>{
                    // Remove the data URL prefix to get just the base64 string
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            base64Files.push({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64
            });
        } catch (error) {
            console.error(`Error converting file ${file.name} to base64:`, error);
            throw new Error(`Failed to process file ${file.name}`);
        }
    }
    return base64Files;
}
// Show/hide elements
function showElement(element) {
    element.classList.remove('hidden');
}
function hideElement(element) {
    element.classList.add('hidden');
}
function hideAllMessages() {
    hideElement(loadingSpinner);
    hideElement(successMessage);
    hideElement(errorMessage);
}
// Submit form data to Azure Function
async function submitToAzureFunction(formData) {
    console.log('Submitting form data to Azure Function:', formData);
    try {
        let token = null;
        // Try to get token if user is authenticated
        if (auth0) try {
            const isAuthenticated = await auth0.isAuthenticated();
            console.log('User is authenticated:', isAuthenticated);
            if (isAuthenticated) {
                token = await auth0.getTokenSilently({
                    audience: 'https://equipment-move-api'
                });
                console.log('Token obtained:', token ? 'Yes' : 'No');
                // Validate token format before using it
                if (token && token.split('.').length === 3) console.log('Token format is valid');
                else {
                    console.warn('Token format is invalid, proceeding without token');
                    token = null;
                }
            } else console.log('User not authenticated, proceeding without token');
        } catch (error) {
            console.warn('Could not get auth token:', error);
            // Clear any potentially corrupted token state
            token = null;
        // For production, you might want to require authentication
        // throw new Error('Authentication required. Please log in and try again.');
        }
        else console.warn('Auth0 client is not initialized.');
        const files = formData.getAll('photos');
        const base64Files = await convertFilesToBase64(files);
        const data = {
            userName: formData.get('userName').trim(),
            unitNumber: formData.get('unitNumber').trim(),
            moveDate: formData.get('moveDate'),
            equipmentHours: parseFloat(formData.get('equipmentHours')),
            locationFrom: formData.get('locationFrom').trim(),
            locationTo: formData.get('locationTo').trim(),
            notes: formData.get('notes').trim() || '',
            photos: base64Files,
            submittedAt: new Date().toISOString()
        };
        const headers = {
            'Content-Type': 'application/json'
        };
        // Only add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header added');
        } else console.log('No token available, proceeding without Authorization header');
        console.log('Request headers:', headers);
        console.log('Making request to:', CONFIG.AZURE_FUNCTION_URL);
        const response = await fetch(CONFIG.AZURE_FUNCTION_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData);
            throw new Error(`HTTP ${response.status}: ${errorData}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error submitting to Azure Function:', error);
        throw error;
    }
}
// Handle form submission
async function handleFormSubmit(event) {
    console.log('Form submitted:', event);
    event.preventDefault();
    // Hide all messages and show loading
    hideAllMessages();
    showElement(loadingSpinner);
    // Disable form
    const submitButton = form.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    try {
        const formData = new FormData(form);
        // Validate form
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) throw new Error(validationErrors.join(', '));
        // Submit to Azure Function
        console.log('Form data before submission:', Object.fromEntries(formData.entries()));
        const result = await submitToAzureFunction(formData);
        // Show success message
        hideElement(loadingSpinner);
        showElement(successMessage);
        // Reset form
        form.reset();
        console.log('Form submitted successfully:', result);
    } catch (error) {
        console.error('Form submission error:', error);
        // Show error message
        hideElement(loadingSpinner);
        errorText.textContent = error.message || 'An unexpected error occurred. Please try again.';
        showElement(errorMessage);
    } finally{
        // Re-enable form
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Equipment Move';
    }
}
// Auth0 configuration
let auth0 = null;
async function configureAuth0() {
    auth0 = await (0, _auth0SpaJs.createAuth0Client)({
        domain: 'dev-35fa67pf2b1sd6co.us.auth0.com',
        clientId: 'rt56olchMDdpVVZdsQDk7vP2Tr1bHK5f',
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: 'https://equipment-move-api' // Add API audience for JWT tokens
        }
    });
    // Check if the user is returning from Auth0 login
    const query = window.location.search;
    console.log('Query params:', query);
    if (query.includes('code=') && query.includes('state=')) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, '/'); // Remove query params
    } else if (query.includes('error=')) {
        const error = query.split('error=')[1];
        console.error('Auth0 error:', error);
        alert(`Authentication error: ${error}`);
        logout(); // Clear any session state
        window.history.replaceState({}, document.title, '/'); // Remove query params
    }
    // Check if the user is authenticated
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0.getUser();
        console.log('User:', user);
        document.getElementById('userEmail').textContent = `Logged in as: ${user.email}`;
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        return;
    }
    // Show login button if not authenticated
    document.getElementById('loginButton').style.display = 'block';
}
async function login() {
    await auth0.loginWithRedirect();
}
async function logout() {
    await auth0.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
}
document.getElementById('loginButton').addEventListener('click', ()=>{
    login();
    console.log('Login button clicked');
});
document.getElementById('logoutButton').addEventListener('click', logout);
// Initialize Auth0 on page load
window.onload = configureAuth0;
// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', handleFormSubmit);
    // Add real-time validation for file inputs
    const fileInput = document.getElementById('photos');
    fileInput.addEventListener('change', function(event) {
        const files = Array.from(event.target.files);
        let hasErrors = false;
        files.forEach((file)=>{
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                hasErrors = true;
            }
            if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
                alert(`File ${file.name} is not a valid image format. Please select JPEG, PNG, or GIF files.`);
                hasErrors = true;
            }
        });
        if (hasErrors) event.target.value = ''; // Clear the input
    });
    // Set today's date as default for move date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('moveDate').value = today;
});
// Export for testing (if needed)
if (module.exports) module.exports = {
    validateForm,
    convertFilesToBase64,
    submitToAzureFunction
};
console.log(typeof (0, _auth0SpaJs.createAuth0Client)); // Should log "function"

},{"@auth0/auth0-spa-js":"cy3kg"}],"cy3kg":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Auth0Client", ()=>te);
parcelHelpers.export(exports, "AuthenticationError", ()=>d);
parcelHelpers.export(exports, "CacheKey", ()=>z);
parcelHelpers.export(exports, "GenericError", ()=>u);
parcelHelpers.export(exports, "InMemoryCache", ()=>P);
parcelHelpers.export(exports, "LocalStorageCache", ()=>C);
parcelHelpers.export(exports, "MfaRequiredError", ()=>m);
parcelHelpers.export(exports, "MissingRefreshTokenError", ()=>f);
parcelHelpers.export(exports, "PopupCancelledError", ()=>p);
parcelHelpers.export(exports, "PopupTimeoutError", ()=>h);
parcelHelpers.export(exports, "TimeoutError", ()=>l);
parcelHelpers.export(exports, "User", ()=>ie);
parcelHelpers.export(exports, "createAuth0Client", ()=>oe);
var global = arguments[3];
function e(e, t) {
    var i = {};
    for(var o in e)Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (i[o] = e[o]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
        var n = 0;
        for(o = Object.getOwnPropertySymbols(e); n < o.length; n++)t.indexOf(o[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[n]) && (i[o[n]] = e[o[n]]);
    }
    return i;
}
"function" == typeof SuppressedError && SuppressedError;
var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
function i(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function o(e, t) {
    return e(t = {
        exports: {}
    }, t.exports), t.exports;
}
var n = o(function(e, t) {
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {
            var e = this;
            this.locked = new Map, this.addToLocked = function(t, i) {
                var o = e.locked.get(t);
                void 0 === o ? void 0 === i ? e.locked.set(t, []) : e.locked.set(t, [
                    i
                ]) : void 0 !== i && (o.unshift(i), e.locked.set(t, o));
            }, this.isLocked = function(t) {
                return e.locked.has(t);
            }, this.lock = function(t) {
                return new Promise(function(i, o) {
                    e.isLocked(t) ? e.addToLocked(t, i) : (e.addToLocked(t), i());
                });
            }, this.unlock = function(t) {
                var i = e.locked.get(t);
                if (void 0 !== i && 0 !== i.length) {
                    var o = i.pop();
                    e.locked.set(t, i), void 0 !== o && setTimeout(o, 0);
                } else e.locked.delete(t);
            };
        }
        return e.getInstance = function() {
            return void 0 === e.instance && (e.instance = new e), e.instance;
        }, e;
    }();
    t.default = function() {
        return i.getInstance();
    };
});
i(n);
var a = i(o(function(e, i) {
    var o = t && t.__awaiter || function(e, t, i, o) {
        return new (i || (i = Promise))(function(n, a) {
            function r(e) {
                try {
                    c(o.next(e));
                } catch (e) {
                    a(e);
                }
            }
            function s(e) {
                try {
                    c(o.throw(e));
                } catch (e) {
                    a(e);
                }
            }
            function c(e) {
                e.done ? n(e.value) : new i(function(t) {
                    t(e.value);
                }).then(r, s);
            }
            c((o = o.apply(e, t || [])).next());
        });
    }, a = t && t.__generator || function(e, t) {
        var i, o, n, a, r = {
            label: 0,
            sent: function() {
                if (1 & n[0]) throw n[1];
                return n[1];
            },
            trys: [],
            ops: []
        };
        return a = {
            next: s(0),
            throw: s(1),
            return: s(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
            return this;
        }), a;
        function s(a) {
            return function(s) {
                return function(a) {
                    if (i) throw new TypeError("Generator is already executing.");
                    for(; r;)try {
                        if (i = 1, o && (n = 2 & a[0] ? o.return : a[0] ? o.throw || ((n = o.return) && n.call(o), 0) : o.next) && !(n = n.call(o, a[1])).done) return n;
                        switch(o = 0, n && (a = [
                            2 & a[0],
                            n.value
                        ]), a[0]){
                            case 0:
                            case 1:
                                n = a;
                                break;
                            case 4:
                                return r.label++, {
                                    value: a[1],
                                    done: !1
                                };
                            case 5:
                                r.label++, o = a[1], a = [
                                    0
                                ];
                                continue;
                            case 7:
                                a = r.ops.pop(), r.trys.pop();
                                continue;
                            default:
                                if (!(n = r.trys, (n = n.length > 0 && n[n.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                    r = 0;
                                    continue;
                                }
                                if (3 === a[0] && (!n || a[1] > n[0] && a[1] < n[3])) {
                                    r.label = a[1];
                                    break;
                                }
                                if (6 === a[0] && r.label < n[1]) {
                                    r.label = n[1], n = a;
                                    break;
                                }
                                if (n && r.label < n[2]) {
                                    r.label = n[2], r.ops.push(a);
                                    break;
                                }
                                n[2] && r.ops.pop(), r.trys.pop();
                                continue;
                        }
                        a = t.call(e, r);
                    } catch (e) {
                        a = [
                            6,
                            e
                        ], o = 0;
                    } finally{
                        i = n = 0;
                    }
                    if (5 & a[0]) throw a[1];
                    return {
                        value: a[0] ? a[1] : void 0,
                        done: !0
                    };
                }([
                    a,
                    s
                ]);
            };
        }
    }, r = t;
    Object.defineProperty(i, "__esModule", {
        value: !0
    });
    var s = "browser-tabs-lock-key", c = {
        key: function(e) {
            return o(r, void 0, void 0, function() {
                return a(this, function(e) {
                    throw new Error("Unsupported");
                });
            });
        },
        getItem: function(e) {
            return o(r, void 0, void 0, function() {
                return a(this, function(e) {
                    throw new Error("Unsupported");
                });
            });
        },
        clear: function() {
            return o(r, void 0, void 0, function() {
                return a(this, function(e) {
                    return [
                        2,
                        window.localStorage.clear()
                    ];
                });
            });
        },
        removeItem: function(e) {
            return o(r, void 0, void 0, function() {
                return a(this, function(e) {
                    throw new Error("Unsupported");
                });
            });
        },
        setItem: function(e, t) {
            return o(r, void 0, void 0, function() {
                return a(this, function(e) {
                    throw new Error("Unsupported");
                });
            });
        },
        keySync: function(e) {
            return window.localStorage.key(e);
        },
        getItemSync: function(e) {
            return window.localStorage.getItem(e);
        },
        clearSync: function() {
            return window.localStorage.clear();
        },
        removeItemSync: function(e) {
            return window.localStorage.removeItem(e);
        },
        setItemSync: function(e, t) {
            return window.localStorage.setItem(e, t);
        }
    };
    function u(e) {
        return new Promise(function(t) {
            return setTimeout(t, e);
        });
    }
    function d(e) {
        for(var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", i = "", o = 0; o < e; o++)i += t[Math.floor(Math.random() * t.length)];
        return i;
    }
    var l = function() {
        function e(t) {
            this.acquiredIatSet = new Set, this.storageHandler = void 0, this.id = Date.now().toString() + d(15), this.acquireLock = this.acquireLock.bind(this), this.releaseLock = this.releaseLock.bind(this), this.releaseLock__private__ = this.releaseLock__private__.bind(this), this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this), this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this), this.storageHandler = t, void 0 === e.waiters && (e.waiters = []);
        }
        return e.prototype.acquireLock = function(t, i) {
            return void 0 === i && (i = 5e3), o(this, void 0, void 0, function() {
                var o, n, r, l, h, p, m;
                return a(this, function(a) {
                    switch(a.label){
                        case 0:
                            o = Date.now() + d(4), n = Date.now() + i, r = s + "-" + t, l = void 0 === this.storageHandler ? c : this.storageHandler, a.label = 1;
                        case 1:
                            return Date.now() < n ? [
                                4,
                                u(30)
                            ] : [
                                3,
                                8
                            ];
                        case 2:
                            return a.sent(), null !== l.getItemSync(r) ? [
                                3,
                                5
                            ] : (h = this.id + "-" + t + "-" + o, [
                                4,
                                u(Math.floor(25 * Math.random()))
                            ]);
                        case 3:
                            return a.sent(), l.setItemSync(r, JSON.stringify({
                                id: this.id,
                                iat: o,
                                timeoutKey: h,
                                timeAcquired: Date.now(),
                                timeRefreshed: Date.now()
                            })), [
                                4,
                                u(30)
                            ];
                        case 4:
                            return a.sent(), null !== (p = l.getItemSync(r)) && (m = JSON.parse(p)).id === this.id && m.iat === o ? (this.acquiredIatSet.add(o), this.refreshLockWhileAcquired(r, o), [
                                2,
                                !0
                            ]) : [
                                3,
                                7
                            ];
                        case 5:
                            return e.lockCorrector(void 0 === this.storageHandler ? c : this.storageHandler), [
                                4,
                                this.waitForSomethingToChange(n)
                            ];
                        case 6:
                            a.sent(), a.label = 7;
                        case 7:
                            return o = Date.now() + d(4), [
                                3,
                                1
                            ];
                        case 8:
                            return [
                                2,
                                !1
                            ];
                    }
                });
            });
        }, e.prototype.refreshLockWhileAcquired = function(e, t) {
            return o(this, void 0, void 0, function() {
                var i = this;
                return a(this, function(r) {
                    return setTimeout(function() {
                        return o(i, void 0, void 0, function() {
                            var i, o, r;
                            return a(this, function(a) {
                                switch(a.label){
                                    case 0:
                                        return [
                                            4,
                                            n.default().lock(t)
                                        ];
                                    case 1:
                                        return a.sent(), this.acquiredIatSet.has(t) ? (i = void 0 === this.storageHandler ? c : this.storageHandler, null === (o = i.getItemSync(e)) ? (n.default().unlock(t), [
                                            2
                                        ]) : ((r = JSON.parse(o)).timeRefreshed = Date.now(), i.setItemSync(e, JSON.stringify(r)), n.default().unlock(t), this.refreshLockWhileAcquired(e, t), [
                                            2
                                        ])) : (n.default().unlock(t), [
                                            2
                                        ]);
                                }
                            });
                        });
                    }, 1e3), [
                        2
                    ];
                });
            });
        }, e.prototype.waitForSomethingToChange = function(t) {
            return o(this, void 0, void 0, function() {
                return a(this, function(i) {
                    switch(i.label){
                        case 0:
                            return [
                                4,
                                new Promise(function(i) {
                                    var o = !1, n = Date.now(), a = !1;
                                    function r() {
                                        if (a || (window.removeEventListener("storage", r), e.removeFromWaiting(r), clearTimeout(s), a = !0), !o) {
                                            o = !0;
                                            var t = 50 - (Date.now() - n);
                                            t > 0 ? setTimeout(i, t) : i(null);
                                        }
                                    }
                                    window.addEventListener("storage", r), e.addToWaiting(r);
                                    var s = setTimeout(r, Math.max(0, t - Date.now()));
                                })
                            ];
                        case 1:
                            return i.sent(), [
                                2
                            ];
                    }
                });
            });
        }, e.addToWaiting = function(t) {
            this.removeFromWaiting(t), void 0 !== e.waiters && e.waiters.push(t);
        }, e.removeFromWaiting = function(t) {
            void 0 !== e.waiters && (e.waiters = e.waiters.filter(function(e) {
                return e !== t;
            }));
        }, e.notifyWaiters = function() {
            void 0 !== e.waiters && e.waiters.slice().forEach(function(e) {
                return e();
            });
        }, e.prototype.releaseLock = function(e) {
            return o(this, void 0, void 0, function() {
                return a(this, function(t) {
                    switch(t.label){
                        case 0:
                            return [
                                4,
                                this.releaseLock__private__(e)
                            ];
                        case 1:
                            return [
                                2,
                                t.sent()
                            ];
                    }
                });
            });
        }, e.prototype.releaseLock__private__ = function(t) {
            return o(this, void 0, void 0, function() {
                var i, o, r, u;
                return a(this, function(a) {
                    switch(a.label){
                        case 0:
                            return i = void 0 === this.storageHandler ? c : this.storageHandler, o = s + "-" + t, null === (r = i.getItemSync(o)) ? [
                                2
                            ] : (u = JSON.parse(r)).id !== this.id ? [
                                3,
                                2
                            ] : [
                                4,
                                n.default().lock(u.iat)
                            ];
                        case 1:
                            a.sent(), this.acquiredIatSet.delete(u.iat), i.removeItemSync(o), n.default().unlock(u.iat), e.notifyWaiters(), a.label = 2;
                        case 2:
                            return [
                                2
                            ];
                    }
                });
            });
        }, e.lockCorrector = function(t) {
            for(var i = Date.now() - 5e3, o = t, n = [], a = 0;;){
                var r = o.keySync(a);
                if (null === r) break;
                n.push(r), a++;
            }
            for(var c = !1, u = 0; u < n.length; u++){
                var d = n[u];
                if (d.includes(s)) {
                    var l = o.getItemSync(d);
                    if (null !== l) {
                        var h = JSON.parse(l);
                        (void 0 === h.timeRefreshed && h.timeAcquired < i || void 0 !== h.timeRefreshed && h.timeRefreshed < i) && (o.removeItemSync(d), c = !0);
                    }
                }
            }
            c && e.notifyWaiters();
        }, e.waiters = void 0, e;
    }();
    i.default = l;
}));
const r = {
    timeoutInSeconds: 60
}, s = {
    name: "auth0-spa-js",
    version: "2.3.0"
}, c = ()=>Date.now();
class u extends Error {
    constructor(e, t){
        super(t), this.error = e, this.error_description = t, Object.setPrototypeOf(this, u.prototype);
    }
    static fromPayload({ error: e, error_description: t }) {
        return new u(e, t);
    }
}
class d extends u {
    constructor(e, t, i, o = null){
        super(e, t), this.state = i, this.appState = o, Object.setPrototypeOf(this, d.prototype);
    }
}
class l extends u {
    constructor(){
        super("timeout", "Timeout"), Object.setPrototypeOf(this, l.prototype);
    }
}
class h extends l {
    constructor(e){
        super(), this.popup = e, Object.setPrototypeOf(this, h.prototype);
    }
}
class p extends u {
    constructor(e){
        super("cancelled", "Popup closed"), this.popup = e, Object.setPrototypeOf(this, p.prototype);
    }
}
class m extends u {
    constructor(e, t, i){
        super(e, t), this.mfa_token = i, Object.setPrototypeOf(this, m.prototype);
    }
}
class f extends u {
    constructor(e, t){
        super("missing_refresh_token", `Missing Refresh Token (audience: '${g(e, [
            "default"
        ])}', scope: '${g(t)}')`), this.audience = e, this.scope = t, Object.setPrototypeOf(this, f.prototype);
    }
}
function g(e, t = []) {
    return e && !t.includes(e) ? e : "";
}
const w = ()=>window.crypto, y = ()=>{
    const e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
    let t = "";
    return Array.from(w().getRandomValues(new Uint8Array(43))).forEach((i)=>t += e[i % e.length]), t;
}, k = (e)=>btoa(e), v = (t)=>{
    var { clientId: i } = t, o = e(t, [
        "clientId"
    ]);
    return new URLSearchParams(((e)=>Object.keys(e).filter((t)=>void 0 !== e[t]).reduce((t, i)=>Object.assign(Object.assign({}, t), {
                [i]: e[i]
            }), {}))(Object.assign({
        client_id: i
    }, o))).toString();
}, b = (e)=>((e)=>decodeURIComponent(atob(e).split("").map((e)=>"%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)).join("")))(e.replace(/_/g, "/").replace(/-/g, "+")), _ = async (e, t)=>{
    const i = await fetch(e, t);
    return {
        ok: i.ok,
        json: await i.json()
    };
}, I = async (e, t, i)=>{
    const o = new AbortController;
    let n;
    return t.signal = o.signal, Promise.race([
        _(e, t),
        new Promise((e, t)=>{
            n = setTimeout(()=>{
                o.abort(), t(new Error("Timeout when executing 'fetch'"));
            }, i);
        })
    ]).finally(()=>{
        clearTimeout(n);
    });
}, S = async (e, t, i, o, n, a, r)=>{
    var s, c;
    return s = {
        auth: {
            audience: t,
            scope: i
        },
        timeout: n,
        fetchUrl: e,
        fetchOptions: o,
        useFormData: r
    }, c = a, new Promise(function(e, t) {
        const i = new MessageChannel;
        i.port1.onmessage = function(o) {
            o.data.error ? t(new Error(o.data.error)) : e(o.data), i.port1.close();
        }, c.postMessage(s, [
            i.port2
        ]);
    });
}, O = async (e, t, i, o, n, a, r = 1e4)=>n ? S(e, t, i, o, r, n, a) : I(e, o, r);
async function T(t, i) {
    var { baseUrl: o, timeout: n, audience: a, scope: r, auth0Client: c, useFormData: d } = t, l = e(t, [
        "baseUrl",
        "timeout",
        "audience",
        "scope",
        "auth0Client",
        "useFormData"
    ]);
    const h = "urn:ietf:params:oauth:grant-type:token-exchange" === l.grant_type, p = Object.assign(Object.assign(Object.assign({}, l), h && a && {
        audience: a
    }), h && r && {
        scope: r
    }), g = d ? v(p) : JSON.stringify(p);
    return await async function(t, i, o, n, a, r, s) {
        let c, d = null;
        for(let e = 0; e < 3; e++)try {
            c = await O(t, o, n, a, r, s, i), d = null;
            break;
        } catch (e) {
            d = e;
        }
        if (d) throw d;
        const l = c.json, { error: h, error_description: p } = l, g = e(l, [
            "error",
            "error_description"
        ]), { ok: w } = c;
        if (!w) {
            const e = p || `HTTP error. Unable to fetch ${t}`;
            if ("mfa_required" === h) throw new m(h, e, g.mfa_token);
            if ("missing_refresh_token" === h) throw new f(o, n);
            throw new u(h || "request_error", e);
        }
        return g;
    }(`${o}/oauth/token`, n, a || "default", r, {
        method: "POST",
        body: g,
        headers: {
            "Content-Type": d ? "application/x-www-form-urlencoded" : "application/json",
            "Auth0-Client": btoa(JSON.stringify(c || s))
        }
    }, i, d);
}
const j = (...e)=>{
    var t;
    return (t = e.filter(Boolean).join(" ").trim().split(/\s+/), Array.from(new Set(t))).join(" ");
};
class z {
    constructor(e, t = "@@auth0spajs@@", i){
        this.prefix = t, this.suffix = i, this.clientId = e.clientId, this.scope = e.scope, this.audience = e.audience;
    }
    toKey() {
        return [
            this.prefix,
            this.clientId,
            this.audience,
            this.scope,
            this.suffix
        ].filter(Boolean).join("::");
    }
    static fromKey(e) {
        const [t, i, o, n] = e.split("::");
        return new z({
            clientId: i,
            scope: n,
            audience: o
        }, t);
    }
    static fromCacheEntry(e) {
        const { scope: t, audience: i, client_id: o } = e;
        return new z({
            scope: t,
            audience: i,
            clientId: o
        });
    }
}
class C {
    set(e, t) {
        localStorage.setItem(e, JSON.stringify(t));
    }
    get(e) {
        const t = window.localStorage.getItem(e);
        if (t) try {
            return JSON.parse(t);
        } catch (e) {
            return;
        }
    }
    remove(e) {
        localStorage.removeItem(e);
    }
    allKeys() {
        return Object.keys(window.localStorage).filter((e)=>e.startsWith("@@auth0spajs@@"));
    }
}
class P {
    constructor(){
        this.enclosedCache = function() {
            let e = {};
            return {
                set (t, i) {
                    e[t] = i;
                },
                get (t) {
                    const i = e[t];
                    if (i) return i;
                },
                remove (t) {
                    delete e[t];
                },
                allKeys: ()=>Object.keys(e)
            };
        }();
    }
}
class x {
    constructor(e, t, i){
        this.cache = e, this.keyManifest = t, this.nowProvider = i || c;
    }
    async setIdToken(e, t, i) {
        var o;
        const n = this.getIdTokenCacheKey(e);
        await this.cache.set(n, {
            id_token: t,
            decodedToken: i
        }), await (null === (o = this.keyManifest) || void 0 === o ? void 0 : o.add(n));
    }
    async getIdToken(e) {
        const t = await this.cache.get(this.getIdTokenCacheKey(e.clientId));
        if (!t && e.scope && e.audience) {
            const t = await this.get(e);
            if (!t) return;
            if (!t.id_token || !t.decodedToken) return;
            return {
                id_token: t.id_token,
                decodedToken: t.decodedToken
            };
        }
        if (t) return {
            id_token: t.id_token,
            decodedToken: t.decodedToken
        };
    }
    async get(e, t = 0) {
        var i;
        let o = await this.cache.get(e.toKey());
        if (!o) {
            const t = await this.getCacheKeys();
            if (!t) return;
            const i = this.matchExistingCacheKey(e, t);
            i && (o = await this.cache.get(i));
        }
        if (!o) return;
        const n = await this.nowProvider(), a = Math.floor(n / 1e3);
        return o.expiresAt - t < a ? o.body.refresh_token ? (o.body = {
            refresh_token: o.body.refresh_token
        }, await this.cache.set(e.toKey(), o), o.body) : (await this.cache.remove(e.toKey()), void await (null === (i = this.keyManifest) || void 0 === i ? void 0 : i.remove(e.toKey()))) : o.body;
    }
    async set(e) {
        var t;
        const i = new z({
            clientId: e.client_id,
            scope: e.scope,
            audience: e.audience
        }), o = await this.wrapCacheEntry(e);
        await this.cache.set(i.toKey(), o), await (null === (t = this.keyManifest) || void 0 === t ? void 0 : t.add(i.toKey()));
    }
    async clear(e) {
        var t;
        const i = await this.getCacheKeys();
        i && (await i.filter((t)=>!e || t.includes(e)).reduce(async (e, t)=>{
            await e, await this.cache.remove(t);
        }, Promise.resolve()), await (null === (t = this.keyManifest) || void 0 === t ? void 0 : t.clear()));
    }
    async wrapCacheEntry(e) {
        const t = await this.nowProvider();
        return {
            body: e,
            expiresAt: Math.floor(t / 1e3) + e.expires_in
        };
    }
    async getCacheKeys() {
        var e;
        return this.keyManifest ? null === (e = await this.keyManifest.get()) || void 0 === e ? void 0 : e.keys : this.cache.allKeys ? this.cache.allKeys() : void 0;
    }
    getIdTokenCacheKey(e) {
        return new z({
            clientId: e
        }, "@@auth0spajs@@", "@@user@@").toKey();
    }
    matchExistingCacheKey(e, t) {
        return t.filter((t)=>{
            var i;
            const o = z.fromKey(t), n = new Set(o.scope && o.scope.split(" ")), a = (null === (i = e.scope) || void 0 === i ? void 0 : i.split(" ")) || [], r = o.scope && a.reduce((e, t)=>e && n.has(t), !0);
            return "@@auth0spajs@@" === o.prefix && o.clientId === e.clientId && o.audience === e.audience && r;
        })[0];
    }
}
class Z {
    constructor(e, t, i){
        this.storage = e, this.clientId = t, this.cookieDomain = i, this.storageKey = `a0.spajs.txs.${this.clientId}`;
    }
    create(e) {
        this.storage.save(this.storageKey, e, {
            daysUntilExpire: 1,
            cookieDomain: this.cookieDomain
        });
    }
    get() {
        return this.storage.get(this.storageKey);
    }
    remove() {
        this.storage.remove(this.storageKey, {
            cookieDomain: this.cookieDomain
        });
    }
}
const K = (e)=>"number" == typeof e, W = [
    "iss",
    "aud",
    "exp",
    "nbf",
    "iat",
    "jti",
    "azp",
    "nonce",
    "auth_time",
    "at_hash",
    "c_hash",
    "acr",
    "amr",
    "sub_jwk",
    "cnf",
    "sip_from_tag",
    "sip_date",
    "sip_callid",
    "sip_cseq_num",
    "sip_via_branch",
    "orig",
    "dest",
    "mky",
    "events",
    "toe",
    "txn",
    "rph",
    "sid",
    "vot",
    "vtm"
], E = (e)=>{
    if (!e.id_token) throw new Error("ID token is required but missing");
    const t = ((e)=>{
        const t = e.split("."), [i, o, n] = t;
        if (3 !== t.length || !i || !o || !n) throw new Error("ID token could not be decoded");
        const a = JSON.parse(b(o)), r = {
            __raw: e
        }, s = {};
        return Object.keys(a).forEach((e)=>{
            r[e] = a[e], W.includes(e) || (s[e] = a[e]);
        }), {
            encoded: {
                header: i,
                payload: o,
                signature: n
            },
            header: JSON.parse(b(i)),
            claims: r,
            user: s
        };
    })(e.id_token);
    if (!t.claims.iss) throw new Error("Issuer (iss) claim must be a string present in the ID token");
    if (t.claims.iss !== e.iss) throw new Error(`Issuer (iss) claim mismatch in the ID token; expected "${e.iss}", found "${t.claims.iss}"`);
    if (!t.user.sub) throw new Error("Subject (sub) claim must be a string present in the ID token");
    if ("RS256" !== t.header.alg) throw new Error(`Signature algorithm of "${t.header.alg}" is not supported. Expected the ID token to be signed with "RS256".`);
    if (!t.claims.aud || "string" != typeof t.claims.aud && !Array.isArray(t.claims.aud)) throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");
    if (Array.isArray(t.claims.aud)) {
        if (!t.claims.aud.includes(e.aud)) throw new Error(`Audience (aud) claim mismatch in the ID token; expected "${e.aud}" but was not one of "${t.claims.aud.join(", ")}"`);
        if (t.claims.aud.length > 1) {
            if (!t.claims.azp) throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");
            if (t.claims.azp !== e.aud) throw new Error(`Authorized Party (azp) claim mismatch in the ID token; expected "${e.aud}", found "${t.claims.azp}"`);
        }
    } else if (t.claims.aud !== e.aud) throw new Error(`Audience (aud) claim mismatch in the ID token; expected "${e.aud}" but found "${t.claims.aud}"`);
    if (e.nonce) {
        if (!t.claims.nonce) throw new Error("Nonce (nonce) claim must be a string present in the ID token");
        if (t.claims.nonce !== e.nonce) throw new Error(`Nonce (nonce) claim mismatch in the ID token; expected "${e.nonce}", found "${t.claims.nonce}"`);
    }
    if (e.max_age && !K(t.claims.auth_time)) throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");
    if (null == t.claims.exp || !K(t.claims.exp)) throw new Error("Expiration Time (exp) claim must be a number present in the ID token");
    if (!K(t.claims.iat)) throw new Error("Issued At (iat) claim must be a number present in the ID token");
    const i = e.leeway || 60, o = new Date(e.now || Date.now()), n = new Date(0);
    if (n.setUTCSeconds(t.claims.exp + i), o > n) throw new Error(`Expiration Time (exp) claim error in the ID token; current time (${o}) is after expiration time (${n})`);
    if (null != t.claims.nbf && K(t.claims.nbf)) {
        const e = new Date(0);
        if (e.setUTCSeconds(t.claims.nbf - i), o < e) throw new Error(`Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Current time (${o}) is before ${e}`);
    }
    if (null != t.claims.auth_time && K(t.claims.auth_time)) {
        const n = new Date(0);
        if (n.setUTCSeconds(parseInt(t.claims.auth_time) + e.max_age + i), o > n) throw new Error(`Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Current time (${o}) is after last auth at ${n}`);
    }
    if (e.organization) {
        const i = e.organization.trim();
        if (i.startsWith("org_")) {
            const e = i;
            if (!t.claims.org_id) throw new Error("Organization ID (org_id) claim must be a string present in the ID token");
            if (e !== t.claims.org_id) throw new Error(`Organization ID (org_id) claim mismatch in the ID token; expected "${e}", found "${t.claims.org_id}"`);
        } else {
            const e = i.toLowerCase();
            if (!t.claims.org_name) throw new Error("Organization Name (org_name) claim must be a string present in the ID token");
            if (e !== t.claims.org_name) throw new Error(`Organization Name (org_name) claim mismatch in the ID token; expected "${e}", found "${t.claims.org_name}"`);
        }
    }
    return t;
};
var R = o(function(e, i) {
    var o = t && t.__assign || function() {
        return o = Object.assign || function(e) {
            for(var t, i = 1, o = arguments.length; i < o; i++)for(var n in t = arguments[i])Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
            return e;
        }, o.apply(this, arguments);
    };
    function n(e, t) {
        if (!t) return "";
        var i = "; " + e;
        return !0 === t ? i : i + "=" + t;
    }
    function a(e, t, i) {
        return encodeURIComponent(e).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/\(/g, "%28").replace(/\)/g, "%29") + "=" + encodeURIComponent(t).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + function(e) {
            if ("number" == typeof e.expires) {
                var t = new Date;
                t.setMilliseconds(t.getMilliseconds() + 864e5 * e.expires), e.expires = t;
            }
            return n("Expires", e.expires ? e.expires.toUTCString() : "") + n("Domain", e.domain) + n("Path", e.path) + n("Secure", e.secure) + n("SameSite", e.sameSite);
        }(i);
    }
    function r(e) {
        for(var t = {}, i = e ? e.split("; ") : [], o = /(%[\dA-F]{2})+/gi, n = 0; n < i.length; n++){
            var a = i[n].split("="), r = a.slice(1).join("=");
            '"' === r.charAt(0) && (r = r.slice(1, -1));
            try {
                t[a[0].replace(o, decodeURIComponent)] = r.replace(o, decodeURIComponent);
            } catch (e) {}
        }
        return t;
    }
    function s() {
        return r(document.cookie);
    }
    function c(e, t, i) {
        document.cookie = a(e, t, o({
            path: "/"
        }, i));
    }
    i.__esModule = !0, i.encode = a, i.parse = r, i.getAll = s, i.get = function(e) {
        return s()[e];
    }, i.set = c, i.remove = function(e, t) {
        c(e, "", o(o({}, t), {
            expires: -1
        }));
    };
});
i(R), R.encode, R.parse, R.getAll;
var U = R.get, L = R.set, D = R.remove;
const X = {
    get (e) {
        const t = U(e);
        if (void 0 !== t) return JSON.parse(t);
    },
    save (e, t, i) {
        let o = {};
        "https:" === window.location.protocol && (o = {
            secure: !0,
            sameSite: "none"
        }), (null == i ? void 0 : i.daysUntilExpire) && (o.expires = i.daysUntilExpire), (null == i ? void 0 : i.cookieDomain) && (o.domain = i.cookieDomain), L(e, JSON.stringify(t), o);
    },
    remove (e, t) {
        let i = {};
        (null == t ? void 0 : t.cookieDomain) && (i.domain = t.cookieDomain), D(e, i);
    }
}, N = {
    get (e) {
        const t = X.get(e);
        return t || X.get(`_legacy_${e}`);
    },
    save (e, t, i) {
        let o = {};
        "https:" === window.location.protocol && (o = {
            secure: !0
        }), (null == i ? void 0 : i.daysUntilExpire) && (o.expires = i.daysUntilExpire), (null == i ? void 0 : i.cookieDomain) && (o.domain = i.cookieDomain), L(`_legacy_${e}`, JSON.stringify(t), o), X.save(e, t, i);
    },
    remove (e, t) {
        let i = {};
        (null == t ? void 0 : t.cookieDomain) && (i.domain = t.cookieDomain), D(e, i), X.remove(e, t), X.remove(`_legacy_${e}`, t);
    }
}, J = {
    get (e) {
        if ("undefined" == typeof sessionStorage) return;
        const t = sessionStorage.getItem(e);
        return null != t ? JSON.parse(t) : void 0;
    },
    save (e, t) {
        sessionStorage.setItem(e, JSON.stringify(t));
    },
    remove (e) {
        sessionStorage.removeItem(e);
    }
};
function F(e, t, i) {
    var o = void 0 === t ? null : t, n = function(e, t) {
        var i = atob(e);
        if (t) {
            for(var o = new Uint8Array(i.length), n = 0, a = i.length; n < a; ++n)o[n] = i.charCodeAt(n);
            return String.fromCharCode.apply(null, new Uint16Array(o.buffer));
        }
        return i;
    }(e, void 0 !== i && i), a = n.indexOf("\n", 10) + 1, r = n.substring(a) + (o ? "//# sourceMappingURL=" + o : ""), s = new Blob([
        r
    ], {
        type: "application/javascript"
    });
    return URL.createObjectURL(s);
}
var H, Y, G, V, M = (H = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Y2xhc3MgZSBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHQscil7c3VwZXIociksdGhpcy5lcnJvcj10LHRoaXMuZXJyb3JfZGVzY3JpcHRpb249cixPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcyxlLnByb3RvdHlwZSl9c3RhdGljIGZyb21QYXlsb2FkKHtlcnJvcjp0LGVycm9yX2Rlc2NyaXB0aW9uOnJ9KXtyZXR1cm4gbmV3IGUodCxyKX19Y2xhc3MgdCBleHRlbmRzIGV7Y29uc3RydWN0b3IoZSxzKXtzdXBlcigibWlzc2luZ19yZWZyZXNoX3Rva2VuIixgTWlzc2luZyBSZWZyZXNoIFRva2VuIChhdWRpZW5jZTogJyR7cihlLFsiZGVmYXVsdCJdKX0nLCBzY29wZTogJyR7cihzKX0nKWApLHRoaXMuYXVkaWVuY2U9ZSx0aGlzLnNjb3BlPXMsT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsdC5wcm90b3R5cGUpfX1mdW5jdGlvbiByKGUsdD1bXSl7cmV0dXJuIGUmJiF0LmluY2x1ZGVzKGUpP2U6IiJ9ImZ1bmN0aW9uIj09dHlwZW9mIFN1cHByZXNzZWRFcnJvciYmU3VwcHJlc3NlZEVycm9yO2NvbnN0IHM9ZT0+e3ZhcntjbGllbnRJZDp0fT1lLHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj17fTtmb3IodmFyIHMgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxzKSYmdC5pbmRleE9mKHMpPDAmJihyW3NdPWVbc10pO2lmKG51bGwhPWUmJiJmdW5jdGlvbiI9PXR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKXt2YXIgbz0wO2ZvcihzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZSk7bzxzLmxlbmd0aDtvKyspdC5pbmRleE9mKHNbb10pPDAmJk9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChlLHNbb10pJiYocltzW29dXT1lW3Nbb11dKX1yZXR1cm4gcn0oZSxbImNsaWVudElkIl0pO3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKChlPT5PYmplY3Qua2V5cyhlKS5maWx0ZXIoKHQ9PnZvaWQgMCE9PWVbdF0pKS5yZWR1Y2UoKCh0LHIpPT5PYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sdCkse1tyXTplW3JdfSkpLHt9KSkoT2JqZWN0LmFzc2lnbih7Y2xpZW50X2lkOnR9LHIpKSkudG9TdHJpbmcoKX07bGV0IG89e307Y29uc3Qgbj0oZSx0KT0+YCR7ZX18JHt0fWA7YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsKGFzeW5jKHtkYXRhOnt0aW1lb3V0OmUsYXV0aDpyLGZldGNoVXJsOmksZmV0Y2hPcHRpb25zOmMsdXNlRm9ybURhdGE6YX0scG9ydHM6W3BdfSk9PntsZXQgZjtjb25zdHthdWRpZW5jZTp1LHNjb3BlOmx9PXJ8fHt9O3RyeXtjb25zdCByPWE/KGU9Pntjb25zdCB0PW5ldyBVUkxTZWFyY2hQYXJhbXMoZSkscj17fTtyZXR1cm4gdC5mb3JFYWNoKCgoZSx0KT0+e3JbdF09ZX0pKSxyfSkoYy5ib2R5KTpKU09OLnBhcnNlKGMuYm9keSk7aWYoIXIucmVmcmVzaF90b2tlbiYmInJlZnJlc2hfdG9rZW4iPT09ci5ncmFudF90eXBlKXtjb25zdCBlPSgoZSx0KT0+b1tuKGUsdCldKSh1LGwpO2lmKCFlKXRocm93IG5ldyB0KHUsbCk7Yy5ib2R5PWE/cyhPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30scikse3JlZnJlc2hfdG9rZW46ZX0pKTpKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30scikse3JlZnJlc2hfdG9rZW46ZX0pKX1sZXQgaCxnOyJmdW5jdGlvbiI9PXR5cGVvZiBBYm9ydENvbnRyb2xsZXImJihoPW5ldyBBYm9ydENvbnRyb2xsZXIsYy5zaWduYWw9aC5zaWduYWwpO3RyeXtnPWF3YWl0IFByb21pc2UucmFjZShbKGQ9ZSxuZXcgUHJvbWlzZSgoZT0+c2V0VGltZW91dChlLGQpKSkpLGZldGNoKGksT2JqZWN0LmFzc2lnbih7fSxjKSldKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBwLnBvc3RNZXNzYWdlKHtlcnJvcjplLm1lc3NhZ2V9KX1pZighZylyZXR1cm4gaCYmaC5hYm9ydCgpLHZvaWQgcC5wb3N0TWVzc2FnZSh7ZXJyb3I6IlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyJ9KTtmPWF3YWl0IGcuanNvbigpLGYucmVmcmVzaF90b2tlbj8oKChlLHQscik9PntvW24odCxyKV09ZX0pKGYucmVmcmVzaF90b2tlbix1LGwpLGRlbGV0ZSBmLnJlZnJlc2hfdG9rZW4pOigoZSx0KT0+e2RlbGV0ZSBvW24oZSx0KV19KSh1LGwpLHAucG9zdE1lc3NhZ2Uoe29rOmcub2ssanNvbjpmfSl9Y2F0Y2goZSl7cC5wb3N0TWVzc2FnZSh7b2s6ITEsanNvbjp7ZXJyb3I6ZS5lcnJvcixlcnJvcl9kZXNjcmlwdGlvbjplLm1lc3NhZ2V9fSl9dmFyIGR9KSl9KCk7Cgo=", Y = null, G = !1, function(e) {
    return V = V || F(H, Y, G), new Worker(V, e);
});
const A = {};
class B {
    constructor(e, t){
        this.cache = e, this.clientId = t, this.manifestKey = this.createManifestKeyFrom(this.clientId);
    }
    async add(e) {
        var t;
        const i = new Set((null === (t = await this.cache.get(this.manifestKey)) || void 0 === t ? void 0 : t.keys) || []);
        i.add(e), await this.cache.set(this.manifestKey, {
            keys: [
                ...i
            ]
        });
    }
    async remove(e) {
        const t = await this.cache.get(this.manifestKey);
        if (t) {
            const i = new Set(t.keys);
            return i.delete(e), i.size > 0 ? await this.cache.set(this.manifestKey, {
                keys: [
                    ...i
                ]
            }) : await this.cache.remove(this.manifestKey);
        }
    }
    get() {
        return this.cache.get(this.manifestKey);
    }
    clear() {
        return this.cache.remove(this.manifestKey);
    }
    createManifestKeyFrom(e) {
        return `@@auth0spajs@@::${e}`;
    }
}
const $ = {
    memory: ()=>(new P).enclosedCache,
    localstorage: ()=>new C
}, q = (e)=>$[e], Q = (t)=>{
    const { openUrl: i, onRedirect: o } = t, n = e(t, [
        "openUrl",
        "onRedirect"
    ]);
    return Object.assign(Object.assign({}, n), {
        openUrl: !1 === i || i ? i : o
    });
}, ee = new a;
class te {
    constructor(e){
        let t, i;
        if (this.userCache = (new P).enclosedCache, this.defaultOptions = {
            authorizationParams: {
                scope: "openid profile email"
            },
            useRefreshTokensFallback: !1,
            useFormData: !0
        }, this._releaseLockOnPageHide = async ()=>{
            await ee.releaseLock("auth0.lock.getTokenSilently"), window.removeEventListener("pagehide", this._releaseLockOnPageHide);
        }, this.options = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), e), {
            authorizationParams: Object.assign(Object.assign({}, this.defaultOptions.authorizationParams), e.authorizationParams)
        }), "undefined" != typeof window && (()=>{
            if (!w()) throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");
            if (void 0 === w().subtle) throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/main/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ");
        })(), e.cache && e.cacheLocation && console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."), e.cache) i = e.cache;
        else {
            if (t = e.cacheLocation || "memory", !q(t)) throw new Error(`Invalid cache location "${t}"`);
            i = q(t)();
        }
        this.httpTimeoutMs = e.httpTimeoutInSeconds ? 1e3 * e.httpTimeoutInSeconds : 1e4, this.cookieStorage = !1 === e.legacySameSiteCookie ? X : N, this.orgHintCookieName = `auth0.${this.options.clientId}.organization_hint`, this.isAuthenticatedCookieName = ((e)=>`auth0.${e}.is.authenticated`)(this.options.clientId), this.sessionCheckExpiryDays = e.sessionCheckExpiryDays || 1;
        const o = e.useCookiesForTransactions ? this.cookieStorage : J;
        var n;
        this.scope = j("openid", this.options.authorizationParams.scope, this.options.useRefreshTokens ? "offline_access" : ""), this.transactionManager = new Z(o, this.options.clientId, this.options.cookieDomain), this.nowProvider = this.options.nowProvider || c, this.cacheManager = new x(i, i.allKeys ? void 0 : new B(i, this.options.clientId), this.nowProvider), this.domainUrl = (n = this.options.domain, /^https?:\/\//.test(n) ? n : `https://${n}`), this.tokenIssuer = ((e, t)=>e ? e.startsWith("https://") ? e : `https://${e}/` : `${t}/`)(this.options.issuer, this.domainUrl), "undefined" != typeof window && window.Worker && this.options.useRefreshTokens && "memory" === t && (this.options.workerUrl ? this.worker = new Worker(this.options.workerUrl) : this.worker = new M);
    }
    _url(e) {
        const t = encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client || s)));
        return `${this.domainUrl}${e}&auth0Client=${t}`;
    }
    _authorizeUrl(e) {
        return this._url(`/authorize?${v(e)}`);
    }
    async _verifyIdToken(e, t, i) {
        const o = await this.nowProvider();
        var n;
        return E({
            iss: this.tokenIssuer,
            aud: this.options.clientId,
            id_token: e,
            nonce: t,
            organization: i,
            leeway: this.options.leeway,
            max_age: (n = this.options.authorizationParams.max_age, "string" != typeof n ? n : parseInt(n, 10) || void 0),
            now: o
        });
    }
    _processOrgHint(e) {
        e ? this.cookieStorage.save(this.orgHintCookieName, e, {
            daysUntilExpire: this.sessionCheckExpiryDays,
            cookieDomain: this.options.cookieDomain
        }) : this.cookieStorage.remove(this.orgHintCookieName, {
            cookieDomain: this.options.cookieDomain
        });
    }
    async _prepareAuthorizeUrl(e, t, i) {
        const o = k(y()), n = k(y()), a = y(), r = ((e)=>{
            const t = new Uint8Array(e);
            return ((e)=>{
                const t = {
                    "+": "-",
                    "/": "_",
                    "=": ""
                };
                return e.replace(/[+/=]/g, (e)=>t[e]);
            })(window.btoa(String.fromCharCode(...Array.from(t))));
        })(await (async (e)=>{
            const t = w().subtle.digest({
                name: "SHA-256"
            }, (new TextEncoder).encode(e));
            return await t;
        })(a)), s = ((e, t, i, o, n, a, r, s)=>Object.assign(Object.assign(Object.assign({
                client_id: e.clientId
            }, e.authorizationParams), i), {
                scope: j(t, i.scope),
                response_type: "code",
                response_mode: s || "query",
                state: o,
                nonce: n,
                redirect_uri: r || e.authorizationParams.redirect_uri,
                code_challenge: a,
                code_challenge_method: "S256"
            }))(this.options, this.scope, e, o, n, r, e.redirect_uri || this.options.authorizationParams.redirect_uri || i, null == t ? void 0 : t.response_mode), c = this._authorizeUrl(s);
        return {
            nonce: n,
            code_verifier: a,
            scope: s.scope,
            audience: s.audience || "default",
            redirect_uri: s.redirect_uri,
            state: o,
            url: c
        };
    }
    async loginWithPopup(e, t) {
        var i;
        if (e = e || {}, !(t = t || {}).popup && (t.popup = ((e)=>{
            const t = window.screenX + (window.innerWidth - 400) / 2, i = window.screenY + (window.innerHeight - 600) / 2;
            return window.open(e, "auth0:authorize:popup", `left=${t},top=${i},width=400,height=600,resizable,scrollbars=yes,status=1`);
        })(""), !t.popup)) throw new Error("Unable to open a popup for loginWithPopup - window.open returned `null`");
        const o = await this._prepareAuthorizeUrl(e.authorizationParams || {}, {
            response_mode: "web_message"
        }, window.location.origin);
        t.popup.location.href = o.url;
        const n = await ((e)=>new Promise((t, i)=>{
                let o;
                const n = setInterval(()=>{
                    e.popup && e.popup.closed && (clearInterval(n), clearTimeout(a), window.removeEventListener("message", o, !1), i(new p(e.popup)));
                }, 1e3), a = setTimeout(()=>{
                    clearInterval(n), i(new h(e.popup)), window.removeEventListener("message", o, !1);
                }, 1e3 * (e.timeoutInSeconds || 60));
                o = function(r) {
                    if (r.data && "authorization_response" === r.data.type) {
                        if (clearTimeout(a), clearInterval(n), window.removeEventListener("message", o, !1), e.popup.close(), r.data.response.error) return i(u.fromPayload(r.data.response));
                        t(r.data.response);
                    }
                }, window.addEventListener("message", o);
            }))(Object.assign(Object.assign({}, t), {
            timeoutInSeconds: t.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || 60
        }));
        if (o.state !== n.state) throw new u("state_mismatch", "Invalid state");
        const a = (null === (i = e.authorizationParams) || void 0 === i ? void 0 : i.organization) || this.options.authorizationParams.organization;
        await this._requestToken({
            audience: o.audience,
            scope: o.scope,
            code_verifier: o.code_verifier,
            grant_type: "authorization_code",
            code: n.code,
            redirect_uri: o.redirect_uri
        }, {
            nonceIn: o.nonce,
            organization: a
        });
    }
    async getUser() {
        var e;
        const t = await this._getIdTokenFromCache();
        return null === (e = null == t ? void 0 : t.decodedToken) || void 0 === e ? void 0 : e.user;
    }
    async getIdTokenClaims() {
        var e;
        const t = await this._getIdTokenFromCache();
        return null === (e = null == t ? void 0 : t.decodedToken) || void 0 === e ? void 0 : e.claims;
    }
    async loginWithRedirect(t = {}) {
        var i;
        const o = Q(t), { openUrl: n, fragment: a, appState: r } = o, s = e(o, [
            "openUrl",
            "fragment",
            "appState"
        ]), c = (null === (i = s.authorizationParams) || void 0 === i ? void 0 : i.organization) || this.options.authorizationParams.organization, u = await this._prepareAuthorizeUrl(s.authorizationParams || {}), { url: d } = u, l = e(u, [
            "url"
        ]);
        this.transactionManager.create(Object.assign(Object.assign(Object.assign({}, l), {
            appState: r
        }), c && {
            organization: c
        }));
        const h = a ? `${d}#${a}` : d;
        n ? await n(h) : window.location.assign(h);
    }
    async handleRedirectCallback(e = window.location.href) {
        const t = e.split("?").slice(1);
        if (0 === t.length) throw new Error("There are no query params available for parsing.");
        const { state: i, code: o, error: n, error_description: a } = ((e)=>{
            e.indexOf("#") > -1 && (e = e.substring(0, e.indexOf("#")));
            const t = new URLSearchParams(e);
            return {
                state: t.get("state"),
                code: t.get("code") || void 0,
                error: t.get("error") || void 0,
                error_description: t.get("error_description") || void 0
            };
        })(t.join("")), r = this.transactionManager.get();
        if (!r) throw new u("missing_transaction", "Invalid state");
        if (this.transactionManager.remove(), n) throw new d(n, a || n, i, r.appState);
        if (!r.code_verifier || r.state && r.state !== i) throw new u("state_mismatch", "Invalid state");
        const s = r.organization, c = r.nonce, l = r.redirect_uri;
        return await this._requestToken(Object.assign({
            audience: r.audience,
            scope: r.scope,
            code_verifier: r.code_verifier,
            grant_type: "authorization_code",
            code: o
        }, l ? {
            redirect_uri: l
        } : {}), {
            nonceIn: c,
            organization: s
        }), {
            appState: r.appState
        };
    }
    async checkSession(e) {
        if (!this.cookieStorage.get(this.isAuthenticatedCookieName)) {
            if (!this.cookieStorage.get("auth0.is.authenticated")) return;
            this.cookieStorage.save(this.isAuthenticatedCookieName, !0, {
                daysUntilExpire: this.sessionCheckExpiryDays,
                cookieDomain: this.options.cookieDomain
            }), this.cookieStorage.remove("auth0.is.authenticated");
        }
        try {
            await this.getTokenSilently(e);
        } catch (e) {}
    }
    async getTokenSilently(e = {}) {
        var t;
        const i = Object.assign(Object.assign({
            cacheMode: "on"
        }, e), {
            authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e.authorizationParams), {
                scope: j(this.scope, null === (t = e.authorizationParams) || void 0 === t ? void 0 : t.scope)
            })
        }), o = await ((e, t)=>{
            let i = A[t];
            return i || (i = e().finally(()=>{
                delete A[t], i = null;
            }), A[t] = i), i;
        })(()=>this._getTokenSilently(i), `${this.options.clientId}::${i.authorizationParams.audience}::${i.authorizationParams.scope}`);
        return e.detailedResponse ? o : null == o ? void 0 : o.access_token;
    }
    async _getTokenSilently(t) {
        const { cacheMode: i } = t, o = e(t, [
            "cacheMode"
        ]);
        if ("off" !== i) {
            const e = await this._getEntryFromCache({
                scope: o.authorizationParams.scope,
                audience: o.authorizationParams.audience || "default",
                clientId: this.options.clientId
            });
            if (e) return e;
        }
        if ("cache-only" !== i) {
            if (!await (async (e, t = 3)=>{
                for(let i = 0; i < t; i++)if (await e()) return !0;
                return !1;
            })(()=>ee.acquireLock("auth0.lock.getTokenSilently", 5e3), 10)) throw new l;
            try {
                if (window.addEventListener("pagehide", this._releaseLockOnPageHide), "off" !== i) {
                    const e = await this._getEntryFromCache({
                        scope: o.authorizationParams.scope,
                        audience: o.authorizationParams.audience || "default",
                        clientId: this.options.clientId
                    });
                    if (e) return e;
                }
                const e = this.options.useRefreshTokens ? await this._getTokenUsingRefreshToken(o) : await this._getTokenFromIFrame(o), { id_token: t, access_token: n, oauthTokenScope: a, expires_in: r } = e;
                return Object.assign(Object.assign({
                    id_token: t,
                    access_token: n
                }, a ? {
                    scope: a
                } : null), {
                    expires_in: r
                });
            } finally{
                await ee.releaseLock("auth0.lock.getTokenSilently"), window.removeEventListener("pagehide", this._releaseLockOnPageHide);
            }
        }
    }
    async getTokenWithPopup(e = {}, t = {}) {
        var i;
        const o = Object.assign(Object.assign({}, e), {
            authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e.authorizationParams), {
                scope: j(this.scope, null === (i = e.authorizationParams) || void 0 === i ? void 0 : i.scope)
            })
        });
        t = Object.assign(Object.assign({}, r), t), await this.loginWithPopup(o, t);
        return (await this.cacheManager.get(new z({
            scope: o.authorizationParams.scope,
            audience: o.authorizationParams.audience || "default",
            clientId: this.options.clientId
        }))).access_token;
    }
    async isAuthenticated() {
        return !!await this.getUser();
    }
    _buildLogoutUrl(t) {
        null !== t.clientId ? t.clientId = t.clientId || this.options.clientId : delete t.clientId;
        const i = t.logoutParams || {}, { federated: o } = i, n = e(i, [
            "federated"
        ]), a = o ? "&federated" : "";
        return this._url(`/v2/logout?${v(Object.assign({
            clientId: t.clientId
        }, n))}`) + a;
    }
    async logout(t = {}) {
        const i = Q(t), { openUrl: o } = i, n = e(i, [
            "openUrl"
        ]);
        null === t.clientId ? await this.cacheManager.clear() : await this.cacheManager.clear(t.clientId || this.options.clientId), this.cookieStorage.remove(this.orgHintCookieName, {
            cookieDomain: this.options.cookieDomain
        }), this.cookieStorage.remove(this.isAuthenticatedCookieName, {
            cookieDomain: this.options.cookieDomain
        }), this.userCache.remove("@@user@@");
        const a = this._buildLogoutUrl(n);
        o ? await o(a) : !1 !== o && window.location.assign(a);
    }
    async _getTokenFromIFrame(e) {
        const t = Object.assign(Object.assign({}, e.authorizationParams), {
            prompt: "none"
        }), i = this.cookieStorage.get(this.orgHintCookieName);
        i && !t.organization && (t.organization = i);
        const { url: o, state: n, nonce: a, code_verifier: r, redirect_uri: s, scope: c, audience: d } = await this._prepareAuthorizeUrl(t, {
            response_mode: "web_message"
        }, window.location.origin);
        try {
            if (window.crossOriginIsolated) throw new u("login_required", "The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");
            const i = e.timeoutInSeconds || this.options.authorizeTimeoutInSeconds;
            let h;
            try {
                h = new URL(this.domainUrl).origin;
            } catch (e) {
                h = this.domainUrl;
            }
            const p = await ((e, t, i = 60)=>new Promise((o, n)=>{
                    const a = window.document.createElement("iframe");
                    a.setAttribute("width", "0"), a.setAttribute("height", "0"), a.style.display = "none";
                    const r = ()=>{
                        window.document.body.contains(a) && (window.document.body.removeChild(a), window.removeEventListener("message", s, !1));
                    };
                    let s;
                    const c = setTimeout(()=>{
                        n(new l), r();
                    }, 1e3 * i);
                    s = function(e) {
                        if (e.origin != t) return;
                        if (!e.data || "authorization_response" !== e.data.type) return;
                        const i = e.source;
                        i && i.close(), e.data.response.error ? n(u.fromPayload(e.data.response)) : o(e.data.response), clearTimeout(c), window.removeEventListener("message", s, !1), setTimeout(r, 2e3);
                    }, window.addEventListener("message", s, !1), window.document.body.appendChild(a), a.setAttribute("src", e);
                }))(o, h, i);
            if (n !== p.state) throw new u("state_mismatch", "Invalid state");
            const m = await this._requestToken(Object.assign(Object.assign({}, e.authorizationParams), {
                code_verifier: r,
                code: p.code,
                grant_type: "authorization_code",
                redirect_uri: s,
                timeout: e.authorizationParams.timeout || this.httpTimeoutMs
            }), {
                nonceIn: a,
                organization: t.organization
            });
            return Object.assign(Object.assign({}, m), {
                scope: c,
                oauthTokenScope: m.scope,
                audience: d
            });
        } catch (e) {
            throw "login_required" === e.error && this.logout({
                openUrl: !1
            }), e;
        }
    }
    async _getTokenUsingRefreshToken(e) {
        const t = await this.cacheManager.get(new z({
            scope: e.authorizationParams.scope,
            audience: e.authorizationParams.audience || "default",
            clientId: this.options.clientId
        }));
        if (!(t && t.refresh_token || this.worker)) {
            if (this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e);
            throw new f(e.authorizationParams.audience || "default", e.authorizationParams.scope);
        }
        const i = e.authorizationParams.redirect_uri || this.options.authorizationParams.redirect_uri || window.location.origin, o = "number" == typeof e.timeoutInSeconds ? 1e3 * e.timeoutInSeconds : null;
        try {
            const n = await this._requestToken(Object.assign(Object.assign(Object.assign({}, e.authorizationParams), {
                grant_type: "refresh_token",
                refresh_token: t && t.refresh_token,
                redirect_uri: i
            }), o && {
                timeout: o
            }));
            return Object.assign(Object.assign({}, n), {
                scope: e.authorizationParams.scope,
                oauthTokenScope: n.scope,
                audience: e.authorizationParams.audience || "default"
            });
        } catch (t) {
            if ((t.message.indexOf("Missing Refresh Token") > -1 || t.message && t.message.indexOf("invalid refresh token") > -1) && this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e);
            throw t;
        }
    }
    async _saveEntryInCache(t) {
        const { id_token: i, decodedToken: o } = t, n = e(t, [
            "id_token",
            "decodedToken"
        ]);
        this.userCache.set("@@user@@", {
            id_token: i,
            decodedToken: o
        }), await this.cacheManager.setIdToken(this.options.clientId, t.id_token, t.decodedToken), await this.cacheManager.set(n);
    }
    async _getIdTokenFromCache() {
        const e = this.options.authorizationParams.audience || "default", t = await this.cacheManager.getIdToken(new z({
            clientId: this.options.clientId,
            audience: e,
            scope: this.scope
        })), i = this.userCache.get("@@user@@");
        return t && t.id_token === (null == i ? void 0 : i.id_token) ? i : (this.userCache.set("@@user@@", t), t);
    }
    async _getEntryFromCache({ scope: e, audience: t, clientId: i }) {
        const o = await this.cacheManager.get(new z({
            scope: e,
            audience: t,
            clientId: i
        }), 60);
        if (o && o.access_token) {
            const { access_token: e, oauthTokenScope: t, expires_in: i } = o, n = await this._getIdTokenFromCache();
            return n && Object.assign(Object.assign({
                id_token: n.id_token,
                access_token: e
            }, t ? {
                scope: t
            } : null), {
                expires_in: i
            });
        }
    }
    async _requestToken(e, t) {
        const { nonceIn: i, organization: o } = t || {}, n = await T(Object.assign({
            baseUrl: this.domainUrl,
            client_id: this.options.clientId,
            auth0Client: this.options.auth0Client,
            useFormData: this.options.useFormData,
            timeout: this.httpTimeoutMs
        }, e), this.worker), a = await this._verifyIdToken(n.id_token, i, o);
        return await this._saveEntryInCache(Object.assign(Object.assign(Object.assign(Object.assign({}, n), {
            decodedToken: a,
            scope: e.scope,
            audience: e.audience || "default"
        }), n.scope ? {
            oauthTokenScope: n.scope
        } : null), {
            client_id: this.options.clientId
        })), this.cookieStorage.save(this.isAuthenticatedCookieName, !0, {
            daysUntilExpire: this.sessionCheckExpiryDays,
            cookieDomain: this.options.cookieDomain
        }), this._processOrgHint(o || a.claims.org_id), Object.assign(Object.assign({}, n), {
            decodedToken: a
        });
    }
    async exchangeToken(e) {
        return this._requestToken({
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            subject_token: e.subject_token,
            subject_token_type: e.subject_token_type,
            scope: j(e.scope, this.scope),
            audience: e.audience || this.options.authorizationParams.audience
        });
    }
}
class ie {
}
async function oe(e) {
    const t = new te(e);
    return await t.checkSession(), t;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["n0fw4","kTBnD"], "kTBnD", "parcelRequire94c2", {})

//# sourceMappingURL=frontend.3c14d121.js.map
