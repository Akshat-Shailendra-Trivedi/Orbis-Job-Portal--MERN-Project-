import { CatchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
// import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";

export const postjob = CatchAsyncErrors(async (req, res, next) => {
    const { title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobNiche,} = req.body;

        if( !title ||
            !jobType ||
            !location ||
            !companyName ||
            !introduction ||
            !responsibilities ||
            !qualifications ||
            !salary ||
            !jobNiche){
             
                return next(new ErrorHandler("All fileds are required.", 400));
        }
        if((personalWebsiteTitle && !personalWebsiteUrl) ||
        (!personalWebsiteTitle && personalWebsiteUrl)){
            return next(new ErrorHandler("Please provide both website title and url.", 400));
        }
        const postedBy = req.user._id;
        const job = await Job.create({ postedBy,
            title,
            jobType,
            location,
            companyName,
            introduction,
            responsibilities,
            qualifications,
            offers,
            salary,
            hiringMultipleCandidates,
            personalWebsite :{

                title :personalWebsiteTitle,
                url :personalWebsiteUrl
            },
            jobNiche,
            postedBy
        });
        res.status(201).json({
            success: true,
            job,
        });


});


export const getAllJobs  = CatchAsyncErrors(async(req,res,next)=>{
    const {city, niche, searchKeyword} = req.query;
    const query = {};
    if(city){
        query.location = city;
    }
    if(niche){
        query.jobNiche = niche;
    }
    if(searchKeyword){
        query.$or = [
            { title: { $regex: searchKeyword, $options: "i" } },
            { companyName: { $regex: searchKeyword, $options: "i" } },
            { introduction: { $regex: searchKeyword, $options: "i" } }
        ];
    }
    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        jobs,
        count: jobs.length
    });
    if(!jobs){
        return next(new ErrorHandler("No jobs found", 400));
    }
    });


export const getmyjob = CatchAsyncErrors(async(req,res,next)=>{
    const myJobs = await Job.find({postedBy : req.user._id});
    res.status(200).json({  
        success: true,
        myJobs,
    });
})
export const deletejob = CatchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Oops! Job not found", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully"
    });

})
export const getASinglejob = CatchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler(" Job not found", 404));
    }
    res.status(200).json({
        success: true,
        job,
    });

})