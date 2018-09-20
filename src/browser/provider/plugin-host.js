/* global Symbol */
import Promise from 'pinkie';
import { assignIn } from 'lodash';
import promisifyEvent from 'promisify-event';
import BROWSER_JOB_RESULT from '../../runner/browser-job-result';
import BrowserConnection from '../connection';
import WARNING_MESSAGE from '../../notifications/warning-message';


const name = Symbol();

export default class BrowserProviderPluginHost {
    constructor (providerObject, providerName) {
        this.JOB_RESULT = assignIn({}, BROWSER_JOB_RESULT);

        assignIn(this, providerObject);

        this[name] = providerName;
    }


    // Helpers
    get providerName () {
        return this[name];
    }

    runInitScript (browserId, code) {
        const connection = BrowserConnection.getById(browserId);

        return connection.runInitScript(`(${code})()`);
    }

    waitForConnectionReady (browserId) {
        const connection = BrowserConnection.getById(browserId);

        if (connection.ready)
            return Promise.resolve();

        return promisifyEvent(connection, 'ready');
    }

    reportWarning (browserId, ...args) {
        const connection = BrowserConnection.getById(browserId);

        connection.addWarning(...args);
    }

    setUserAgentMetaInfo (browserId, message) {
        const connection = BrowserConnection.getById(browserId);

        connection.setProviderMetaInfo(message);
    }

    async closeLocalBrowser (browserId) {
        const connection = BrowserConnection.getById(browserId);

        await connection.provider._ensureBrowserWindowDescriptor(browserId);
        await connection.provider._closeLocalBrowser(browserId);
    }

    async resizeLocalBrowserWindow (browserId, width, height, currentWidth, currentHeight) {
        const connection = BrowserConnection.getById(browserId);

        await connection.provider._ensureBrowserWindowParameters(browserId);
        await connection.provider._resizeLocalBrowserWindow(browserId, width, height, currentWidth, currentHeight);
    }

    // API
    // Browser control
    async openBrowser (/* browserId, pageUrl, browserName */) {
        throw new Error('Not implemented!');
    }

    async closeBrowser (/* browserId */) {
        throw new Error('Not implemented!');
    }

    // Initialization
    async init () {
        return;
    }

    async dispose () {
        return;
    }


    // Browser names handling
    async getBrowserList () {
        throw new Error('Not implemented!');
    }

    async isValidBrowserName (/* browserName */) {
        return true;
    }

    // Extra functions
    async isLocalBrowser (/* browserId, browserName */) {
        return false;
    }

    async hasCustomActionForBrowser (/* browserId */) {
        return {
            hasCloseBrowser:                this.hasOwnProperty('closeBrowser'),
            hasResizeWindow:                this.hasOwnProperty('resizeWindow'),
            hasTakeScreenshot:              this.hasOwnProperty('takeScreenshot'),
            hasCanResizeWindowToDimensions: this.hasOwnProperty('canResizeWindowToDimensions'),
            hasMaximizeWindow:              this.hasOwnProperty('maximizeWindow'),
            hasChromelessScreenshots:       false
        };
    }

    async resizeWindow (browserId/*, width, height, currentWidth, currentHeight */) {
        this.reportWarning(browserId, WARNING_MESSAGE.resizeNotSupportedByBrowserProvider, this[name]);
    }

    async canResizeWindowToDimensions (/* browserId, width, height */) {
        return true;
    }

    async takeScreenshot (browserId/*, screenshotPath, pageWidth, pageHeight */) {
        this.reportWarning(browserId, WARNING_MESSAGE.screenshotNotSupportedByBrowserProvider, this[name]);
    }

    async maximizeWindow (browserId) {
        this.reportWarning(browserId, WARNING_MESSAGE.maximizeNotSupportedByBrowserProvider, this[name]);
    }

    async reportJobResult (/*browserId, status, data*/) {
        return;
    }
}
