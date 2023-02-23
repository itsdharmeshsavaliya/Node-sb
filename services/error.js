import CustomErrorHandler from "./customErrorhandler";
const errordetails = {
    // errors(error){
    //     const errorData = {};
    //         for (let item of error.details) {
    //             const name = item.path[0];
    //             const message = item.message;
    //             errorData[name] = message;
    //         }
    //         return CustomErrorHandler.errors(errorData)
    // }

        errors(error){
            const errorData = [];
                error.details.map((item)=>{
                    const error = item.message;
                    errorData.push(error)
                })
                console.log(errorData)
                return CustomErrorHandler.errors(errorData)
        }


}
export default errordetails