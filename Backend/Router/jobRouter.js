import express from "express";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.js";
import { postjob,getAllJobs, getmyjob, deletejob, getASinglejob  } from "../controller/jobController.js";
const router = express.Router();

router.post("/post",  isAuthenticated, isAuthorized("Job Provider"),postjob);
router.get("/getall", getAllJobs);
router.get("/getmyjob", isAuthenticated, isAuthorized("Job Provider"), getmyjob);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Job Provider"), deletejob);
router.get("/getjob/:id",isAuthenticated, getASinglejob);




export default router;