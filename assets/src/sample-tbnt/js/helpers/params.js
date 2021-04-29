'use strict';

class ParametersHelper {
    storage = null;

    init(storage) {
        this.storage = storage;
    }

    reset(parameters) {
        this.storage.setItem('parameters', parameters).save();
    }

    set(path, value) {
        this.storage.updateItem(`parameters.${path}`, value).save();
    }

    get(path, defaultValue) {
        return this.storage.getItem(`parameters.${path}`, defaultValue);
    }
}

const Params = new ParametersHelper();

export default Params;
