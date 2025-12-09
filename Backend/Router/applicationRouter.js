import express from "express";
import { isAuthenticated , isAuthorized } from "../middlewares/auth.js";
import { deleteApplication,
     jobProviderGetAllApplications, 
     jobSeekerGetAllApplications,
      postApplication } from "../controller/applicationController.js";

const router = express.Router();
router.post(
    "/post/:id",
    isAuthenticated,
    isAuthorized("Job Seeker"),
    postApplication
  );
// router.post("/post/:id",isAuthenticated, isAuthorized("Job seeker"),postApplication);
// router.post("/post/:id", isAuthenticated, postApplication);

router.get("/jobProvider/getall",isAuthenticated, isAuthorized("Job Provider"), jobProviderGetAllApplications);

// router.get("/jobSeeker/getall",isAuthenticated, isAuthorized("job seeker"), jobSeekerGetAllApplications);
router.get(
    "/jobseeker/getall",
    isAuthenticated,
    isAuthorized("Job Seeker"),
    jobSeekerGetAllApplications
  );

  router.delete("/delete/:id", isAuthenticated, deleteApplication);

export default router