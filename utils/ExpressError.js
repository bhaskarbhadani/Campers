class ExpressError extends Error{
    constructor(messg,statusCode){
        super();
        this.message=messg;
        this.statusCode=statusCode;
    }
}

module.exports=ExpressError;