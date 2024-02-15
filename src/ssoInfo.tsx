/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { createSignal } from 'solid-js';

let root = document.querySelector("app")

function waitForElm(selector): Promise<HTMLElement> {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


let portal = await waitForElm('.service-links')


console.log(portal)


render(() => {
    const [expiryTime, setExpiryTime] = createSignal(0);
    setInterval(() => setExpiryTime(expiryTime() + 1), 1000);
   return <span _ngcontent-c2 class='user-display-name'>Seconds {expiryTime()}</span>
}, portal!);
