import multer from "multer";
import fs from 'fs';
import path from 'path';
import CustomErrorHandler from "../services/customErrorhandler";
import careerapply from "../validators/careerapply";
import nodemailer from 'nodemailer';
import ejs from 'ejs'

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{ 
        cb(null,'uploads/careerapply')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null,uniqueName)
    }
});

const fileFilter = function (req, file,cb) {
    var ext = path.extname(file.originalname);
    if(ext !== '.doc' && ext !== '.pdf') {
        return cb(new Error('Only files are allowed'))
    }
    cb(null, true)
};

const handlemultipartdata = multer({storage,fileFilter,limits:{fileSize:1000000 * 100}}).single('file');

const careerapplycontroller = {
    async careerapply(req,res,next){
        try{
            handlemultipartdata(req,res, async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename;
                    console.log(req.file)
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('please select file'));
                }
                const {error} = careerapply.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/careerapply/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                let {name,mobile_no,email,status,description,applyingname,noticeperiod} = req.body
                let document;
                document = {
                    // applying,
                    applyingname,
                    file:filepath,
                    name,
                    mobile_no,
                    email,
                    status,
                    noticeperiod,
                    description
                }
                //res.status(201).json(document)
                //res.render("index",{document})
                
                var transporter = nodemailer.createTransport(
                    {
                        service: 'gmail',
                        auth:{
                            user: 'setblue.dharmesh@gmail.com',
                            pass: 'xbwwwlmsurvuabct'
                        }
                    }
                );
    
                ejs.renderFile('./view/index.ejs',{document},function(err,data){
                   
                    if(err){
                        return next(err);
                    }else{
                        var mailOptions = {
                            from: 'setblue.dharmesh@gmail.com', // sender address
                            to: 'ashok.setblue@gmail.com', // list of receivers
                            subject: `cv of ${document.name}:applying for ${document.applyingname}`,
                            html: data, // the name of the template file i.e email.handlebars
                            attachments : [{filename:req.file.filename,path:req.file.path}]
                        };
                
                                // trigger the sending of the E-mail
                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                               return next(error)
                            }
                            res.status(200).json({data:info.response});
                        });
                    }
                })
            })
        }catch(err){
            return next(err)
        }  
    }
}
export default careerapplycontroller