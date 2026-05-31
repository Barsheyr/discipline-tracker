import mongoose, { Document, Schema } from "mongoose";

export interface IHabit {
  id: string;
  name: string;
  done: boolean | null;
  note: string;
  order: number;
}

export interface IDayLog extends Document {
  dateKey: string; // "2025-06-01" — unique per day
  displayDate: string; // "01/06/2025"
  habits: IHabit[];
  reflection: string;
  rating: number; // 0–5
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    id: { type: String, required: true },
    name: { type: String, default: "", trim: true },
    done: { type: Schema.Types.Mixed, default: null },
    note: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const DayLogSchema = new Schema<IDayLog>(
  {
    dateKey: { type: String, required: true, unique: true, index: true },
    displayDate: { type: String, required: true },
    habits: { type: [HabitSchema], default: [] },
    reflection: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

export const DayLog = mongoose.model<IDayLog>("DayLog", DayLogSchema);
