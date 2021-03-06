import hammerhead from '../../deps/hammerhead';

// NOTE: expose Promise to the function code
/* eslint-disable @typescript-eslint/no-unused-vars */
const Promise = hammerhead.Promise;
/* eslint-enable @typescript-eslint/no-unused-vars */

// NOTE: evalFunction is isolated into a separate module to
// restrict access to TestCafe intrinsics for the evaluated code.
// It also accepts `__dependencies$` argument which may be used by evaluated code.
/* eslint-disable @typescript-eslint/no-unused-vars */
export default function evalFunction (fnCode, __dependencies$) {
    // NOTE: `eval` in strict mode will not override context variables
    'use strict';

    /* eslint-disable no-eval */
    return eval(fnCode);
    /* eslint-enable no-eval */
}
/* eslint-enable @typescript-eslint/no-unused-vars */
