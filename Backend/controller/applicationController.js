import { CatchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const postApplication = CatchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // The jobId from the URL params
  const { name, email, phone, address, coverLetter } = req.body; // Form data from the request body
  
  // Validate required fields
  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields are required.", 400));
  }
  
  // Create the jobSeekerInfo object
  const jobSeekerInfo = {
    id: req.user._id, // Ensure this is populated correctly via authentication middleware
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job Seeker",
  };
  
  // Fetch the job details by ID
  const jobDetails = await Job.findById(id);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // Check if the user has already applied to this job
  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });
  if (isAlreadyApplied) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }
  
  // Handle resume upload (Cloudinary)
  if (req.files && req.files.resume) {
    const { resume } = req.files;
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to upload resume to Cloudinary.", 500));
      }
      
      jobSeekerInfo.resume = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  } else {
    // Fallback to user's existing resume if no new resume is uploaded
    if (req.user && !req.user.resume.url) {
      return next(new ErrorHandler("Please upload your resume.", 400));
    }
    jobSeekerInfo.resume = {
      public_id: req.user && req.user.resume.public_id,
      url: req.user && req.user.resume.url,
    };
  }

  // Define the jobProviderInfo object
  const jobProviderInfo = {
    id: jobDetails.postedBy, // The job's postedBy field (job provider)
    role: "jobProvider",
  };

  // Define the jobInfo object
  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
  };

  // Create a new application
  const application = await Application.create({
    jobSeekerInfo,
    jobProviderInfo,
    jobInfo,
  });

  // Respond with a success message
  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
});





export const jobProviderGetAllApplications = CatchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobProviderInfo.id": _id,
      "deletedBy.jobProvider": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);




export const jobSeekerGetAllApplications = CatchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);




export const deleteApplication = CatchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found.", 404));
  }
  const { role } = req.user;
  switch (role) {
    case "Job Seeker":
      application.deletedBy.jobSeeker = true;
      await application.save();
      break;
    case "Job Provider":
      application.deletedBy.jobProvider = true;
      await application.save();
      break;

    default:
      console.log("Default case for application delete function.");
      break;
  }

  if (
    application.deletedBy.jobProvider === true &&
    application.deletedBy.jobSeeker === true
  ) {
    await application.deleteOne();
  }
  res.status(200).json({
    success: true,
    message: "Application Deleted.",
  });
});

