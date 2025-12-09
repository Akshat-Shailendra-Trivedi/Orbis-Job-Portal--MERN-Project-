// import mongoose from "mongoose";
// import validator from "validator";
// const applicationSchema = new mongoose.Schema({
//     jobSeekerInfo:{
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//     },
//     name:{
//         type: String,
//         required: true,
//     },
//     email:{
//         type: String,
//         required: true,
//         validator:[validator.isEmail, "Please enter valid email address"]
//     },
//     phone:{
//         type: Number,
//         required: true,
//     },
//     address:{
//         type: String,
//         required: true,
//     },
//     resume: {
//         public_id: { type: String },
//         url: { type: String }
//       },
//     converLetter:{
//         type: String,
//         required: true,
//     },
//     role:{
//         type: String,
//         required: true,
//         enum: ["Job Seeker"],
//     },

//     jobProviderInfo: {
//         id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         role: {
//           type: String,
//           enum: ["jobProviderInfo"],
//           required: true,
//         },
//       },
    

//     jobInfo:{
//        jobId:{
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//     },
//     jobTitle:{
//         type: String,
//         required: true,
//     }
//     },


//     deletedBy:{
//         jobSeeker:{
//           type:Boolean,
//           default:false
//         },
//         jobProvider:{
//           type:Boolean,
//           default:false
//         } 
//         }
//     });

// export const Application = mongoose.model("Application", applicationSchema);



import mongoose from "mongoose";
import validator from "validator";
const applicationSchema = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
  },
  jobProviderInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["jobProvider"],
      required: true,
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },
  deletedBy: {
    jobSeeker: {
      type: Boolean,
      default: false,
    },
    jobProvider: {
      type: Boolean,
      default: false,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);