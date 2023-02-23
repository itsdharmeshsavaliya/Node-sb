import express from "express";
const router = express.Router();
import { bannercontroller, careerapplycontroller, clientcontroller, contactcontroller, developertypesinfocontroller, futurecontroller, gallerycontroller, hobbiescontroller, homecontroller, pmstoolscontroller, portfoliocontroller, servicecontroller, servicescontroller, technologycontroller, telentfaqcontroller, userprofilecontroller } from "../controllers";
import awardcontroller from "../controllers/awardcontroller";
import careercontroller from "../controllers/careercontroller";
import careerformcontroller from "../controllers/careerformcontroller";

router.post('/banner',bannercontroller.store)
router.put('/banner/:id',bannercontroller.update)
router.delete('/banner/:id',bannercontroller.destroy)
router.post('/banner/data',bannercontroller.index);
router.post('/banner/data/:id',bannercontroller.index1)
router.post('/service',servicecontroller.service)
router.put('/service/:id',servicecontroller.update)
router.delete('/service/:id',servicecontroller.destroy)
router.post('/service/data',servicecontroller.index)
router.post('/service/:id',servicecontroller.index1)
router.post('/future/',futurecontroller.future)
router.put('/future/:id',futurecontroller.update)
router.delete('/future/:id',futurecontroller.destroy)
router.get('/future/data',futurecontroller.index)
router.get('/future/:id',futurecontroller.index1)
router.post('/gallery',gallerycontroller.gallery)
router.put('/gallery/:id',gallerycontroller.update)
router.delete('/gallery/:id',gallerycontroller.destroy)
router.post('/gallery/data',gallerycontroller.index)
router.post('/gallery/:id',gallerycontroller.index1)
router.post('/client',clientcontroller.client)
router.put('/client/:id',clientcontroller.update)
router.delete('/client/:id',clientcontroller.destroy)
router.post('/client/data',clientcontroller.index)
router.post('/client/:id',clientcontroller.index1)
router.post('/award',awardcontroller.award)
router.put('/award/:id',awardcontroller.update)
router.delete('/award/:id',awardcontroller.destroy)
router.post('/award/data',awardcontroller.index)
router.post('/award/:id',awardcontroller.index1)
router.post('/career',careercontroller.career)
router.put('/career/:id',careercontroller.update)
router.delete('/career/:id',careercontroller.destroy)
router.get('/career/data',careercontroller.index)
router.get('/career/:id',careercontroller.index1)
router.post('/careerform',careerformcontroller.careerform)
router.put('/careerform/:id',careerformcontroller.update)
router.delete('/careerform/:id',careerformcontroller.destroy)
router.get('/careerform/data',careerformcontroller.index)
router.get('/careerform/:id',careerformcontroller.index1)
router.post('/services',servicescontroller.services)
router.put('/services/:id',servicescontroller.update)
router.delete('/services/:id',servicescontroller.destroy)
router.post('/services/data',servicescontroller.index)
router.post('/services/:id',servicescontroller.index1)
router.post('/portfolio/category',portfoliocontroller.category)
router.put('/portfolio/category/:id',portfoliocontroller.categoryupdate)
router.delete('/portfolio/category/:id',portfoliocontroller.destroy)
router.post('/portfolio/category/data',portfoliocontroller.categoryindex)
router.post('/portfolio',portfoliocontroller.portfolio)
router.put('/portfolio/:id',portfoliocontroller.portfolioupdate)
router.delete('/portfolio/:id',portfoliocontroller.destroyportfolio)
router.post('/portfolio/data',portfoliocontroller.index)
router.post('/portfolio/category/portfoliodata',portfoliocontroller.index1)
router.post('/careerapply',careerapplycontroller.careerapply)
router.post('/contact',contactcontroller.contact)
router.post('/home/data',homecontroller.index)
router.post('/technology',technologycontroller.technology)
router.put('/technology/:id',technologycontroller.technologyupdate)
router.delete('/technology/:id',technologycontroller.destroy)
router.get('/technology/data',technologycontroller.index)
router.get('/technology/:id',technologycontroller.index1)
router.post('/pmstools',pmstoolscontroller.pmstools)
router.put('/pmstools/:id',pmstoolscontroller.pmstoolsupdate)
router.delete('/pmstools/:id',pmstoolscontroller.destroy)
router.post('/pmstools/data',pmstoolscontroller.index)
router.post('/pmstools/:id',pmstoolscontroller.index1)
router.post('/userprofile',userprofilecontroller.userprofile)
router.put('/userprofile/:id',userprofilecontroller.updateuserprofile)
router.delete('/userprofile/:id',userprofilecontroller.destroyuserprofile)
router.post('/userprofile/data',userprofilecontroller.index)
router.post('/userprofile/:id',userprofilecontroller.index1)
router.post('/developertypesinfo',developertypesinfocontroller.developertypesinfo)
router.put('/developertypesinfo/:id',developertypesinfocontroller.updatedevelopertypesinfo)
router.delete('/developertypesinfo/:id',developertypesinfocontroller.destroy)
router.post('/developertypesinfo/data',developertypesinfocontroller.index)
router.post('/developertypesinfo/:id',developertypesinfocontroller.index1)
router.post('/talentfaq',telentfaqcontroller.telentfaq)
router.put('/talentfaq/:id',telentfaqcontroller.updatetelentfaq)
router.delete('/talentfaq/:id',telentfaqcontroller.destroy)
router.get('/talentfaq/data',telentfaqcontroller.index)
router.get('/talentfaq/:id',telentfaqcontroller.index1)
router.post('/hobbies',hobbiescontroller.hobbies)
router.put('/hobbies/:id',hobbiescontroller.hobbiesupdate)
router.delete('/hobbies/:id',hobbiescontroller.destroy)
router.post('/hobbies/data',hobbiescontroller.index)
router.post('/hobbies/:id',hobbiescontroller.index1)
export default router
