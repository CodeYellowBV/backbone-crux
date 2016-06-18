import Wreqr from 'backbone.wreqr';
import _ from 'underscore';

export default Wreqr.EventAggregator.extend({
    trigger(...args) {
        let triggerable = true;

        // Call beforeTrigger.
        if (_.isFunction(this.beforeTrigger)) {
            triggerable = this.beforeTrigger.apply(this, args) !== false;
        }

        // Check triggerable.
        if (triggerable) {
            Wreqr.EventAggregator.prototype.trigger.apply(this, args);
        }
    },
});
