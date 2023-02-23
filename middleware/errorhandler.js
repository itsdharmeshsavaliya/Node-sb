import { ValidationError } from "joi";
import { DEBUG_MODE } from "../config";
import CustomErrorHandler from "../services/customErrorhandler";

const errorhandler = (err,req,res,next)=>{
    let statuscode = 500;
    let data = {
        error:'internal server error',
        ...(DEBUG_MODE === 'true' && {originalError:err.message})

    }
    if(err instanceof ValidationError){
        statuscode = 422;
        data = {
            error:err.message
        }
    }
    if(err instanceof CustomErrorHandler){
        statuscode = err.status;
        data = {
            error:err.message
        }
    }
    return res.status(statuscode).json(data);
}
export default errorhandler;