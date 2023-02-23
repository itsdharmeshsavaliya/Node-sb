import CustomErrorHandler from "../services/customErrorhandler";
import contact from "../validators/contact";
import nodemailer from 'nodemailer';
import ejs from 'ejs';

const contactcontroller = {
    async contact(req,res,next){
        try{
            const {error} = contact.validate(req.body);
            if(error){
                return next(error)
            }
            const {services,name,mobile_no,email,country,city,address,description} = req.body
            let document;
                document = {
                    services,
                    name,
                    mobile_no,
                    email,
                    country,
                    city,
                    address,
                    description

                }
                //res.render('contact',{document})
            var transporter = nodemailer.createTransport(
                {
                    service:"gmail",
                    auth:{
                        user:'setblue.dharmesh@gmail.com',
                        pass:'xbwwwlmsurvuabct'
                    }
                }
            );
            ejs.renderFile('./view/contact.ejs',{document},function(err,data){
                if(err){
                    return next(err)
                }else{
                    var mailoptions={
                        from:'setblue.dharmesh@gmail.com',
                        to:'setblue.ashok@gmail.com',
                        subject:`enquiry from  ${document.name}`,
                        html:data
                    };

                    transporter.sendMail(mailoptions,function(error,info){
                        if(error){
                            return next(error)
                        }
                        res.status(200).json({data:info.response})
                    })
                }
            })
        }catch(err){
            return next(err)
        }
    }   
}
export default contactcontroller;

