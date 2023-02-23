class CustomErrorHandler extends Error {

    constructor(status,msg){
        super();
        this.status = status;
        this.message = msg;
    }
    static servererror(message="Internal server error"){
        return new CustomErrorHandler(500,message)
    }
    static unprocessedEntity(message="Please enter valid data!"){
        return new CustomErrorHandler(422,message)
    }
    static errors(error){
        return new CustomErrorHandler(500,error)
    }
}
export default CustomErrorHandler;