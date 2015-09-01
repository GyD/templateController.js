var templateController = (function(){

    this.config = {};
    this.element;

    /**
     *
     * @param config
     */
    function templateController(config){
        this.config = config;
    }

    /**
     *
     * @param file
     */
    templateController.prototype.render = function(template, context, callback){
        if (this.checkTemplate(template)) {

        }
        else {
            var that = this;
            this.get(this.getTemplateFile(template), function(){
                callback(Handlebars.template(that.getTemplateObject(template))(context));
            });
        }
    };

    /**
     *
     * @param configName
     * @param configValue
     */
    templateController.prototype.setConfig = function(configName, configValue){
        this.config[configName] = configValue;
    };


    /**
     *
     * @param file
     * @param callback
     */
    templateController.prototype.get = function(file, callback){
        var script = document.createElement('script');
        var prior = document.getElementsByTagName('script')[0];
        script.async = 1;
        prior.parentNode.insertBefore(script, prior);

        script.onload = script.onreadystatechange = function(_, isAbort){
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                if (!isAbort) {
                    if (callback) {
                        callback();
                    }
                }
            }
        };

        script.src = this.getFilePath(file);
    };

    /**
     *
     * @param templateName
     * @returns {*}
     */
    templateController.prototype.getTemplateFile = function(templateName){

        var templateNameArray = templateName.split('.');

        return templateNameArray[templateNameArray.length - 2];
    };


    /**
     *
     * @param file
     * @returns {string}
     */
    templateController.prototype.getFilePath = function(file){
        if (this.config.js) {
            return this.config.dir + file + '.js';
        } else {
            return this.config.dir + file + '.html';
        }
    };

    /**
     *
     * @param templateName
     * @returns {*}
     */
    templateController.prototype.getTemplateObject = function(templateName){
        var thatTemplates = {};

        if (thatTemplates[templateName]) {
            return thatTemplates[templateName];
        }

        var templateNameArray = templateName.split('.');

        var that = window;
        for (i in templateNameArray) {
            if (that[templateNameArray[i]]) {
                that = that[templateNameArray[i]];
            } else {
                return false;
            }
        }

        return thatTemplates[templateName] = that;
    };

    /**
     *
     * @param templateName
     * @returns {boolean}
     */
    templateController.prototype.checkTemplate = function(templateName){

        if (this.getTemplateObject(templateName)) {
            return true;
        }

        return false;
    };


    return templateController;
})();
