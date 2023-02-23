import servicecontroller from './servicecontroller';
import futurecontroller  from './futurecontroller';
import awardcontroller from './awardcontroller';
import clientcontroller from './clientcontroller';
import gallerycontroller from './gallerycontroller';
import bannercontroller from './bannercontroller';

const homecontroller = {
    async index(req,res,next){
        res.status(201).json({
            banner:await bannercontroller.getBanner(),
            service: await servicecontroller.getServices(),
            future: await futurecontroller.getFuture(),
            award: await awardcontroller.getAward(),
            client:await clientcontroller.getClient(),
            gallery:await gallerycontroller.getGallery()
        })
    }
}
export default homecontroller
 