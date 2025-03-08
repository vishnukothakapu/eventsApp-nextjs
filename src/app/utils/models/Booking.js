import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    bookingCode:{
        type: String,
    },
    orderId:{
        type:String,
    },
    paymentId:{
        type:String,
    },
    paymentSign:{
        type:String,
    },
    paymentMethod:{
        type:String,
    },
    paymentBank:{type:String},
    status:{
        type: String,
        enum:['pending','confirmed','cancelled'],
        default: 'pending',
    },
    bookedAt:{
        type: Date,
        default: Date.now,
    },
},{ timestamps: true });
const BookingModel = mongoose.models.Booking||mongoose.model("Booking", BookingSchema);
export default BookingModel;