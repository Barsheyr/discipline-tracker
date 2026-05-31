import mongoose, { Schema } from "mongoose";
const HabitSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, default: "", trim: true },
    done: { type: Schema.Types.Mixed, default: null },
    note: { type: String, default: "" },
    order: { type: Number, default: 0 },
}, { _id: false });
const DayLogSchema = new Schema({
    dateKey: { type: String, required: true, unique: true, index: true },
    displayDate: { type: String, required: true },
    habits: { type: [HabitSchema], default: [] },
    reflection: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
}, { timestamps: true });
export const DayLog = mongoose.model("DayLog", DayLogSchema);
