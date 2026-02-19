import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: { 
        type: String, 
        unique: true, 
        default:() => Math.random().toString(36).substring(2, 11) + Date.now().toString(36) 
    },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);
export default TicketModel;