import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified : {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
    image: { type: String, default: '' },
    address: { type: Object, default: {line1:'',line2:''}},
    gender: {type:String,default:"Not Selected"},
    dob: {type:String,default:"Not Selected"},
    phone: {type:String, default:'0000000000'},
    points: {type: Number, default: 0},
    

})

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel