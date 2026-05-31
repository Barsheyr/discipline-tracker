import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { DayLog } from "../models/DayLog";

const router = Router();

const DEFAULT_HABITS = [
  "Wake up at 6:30 AM",
  "Morning Study Session",
  "Cold Shower",
  "5 hrs of Study",
  "Workout 15 min",
  "Meditation 5 min",
  "Read 5 pages",
  "Eat 80% and no junk",
  "2L of water",
  "Clean my Environment",
  "Skin and Hair care",
  "Plan next day",
  "Journaling",
  "Dinner btw 7–9",
  "Brush at night",
  "Sleep btw 10–11",
];

// GET /api/days — list all days (for history)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const days = await DayLog.find({}).sort({ dateKey: -1 }).limit(90);
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch days" });
  }
});

// GET /api/days/streak — compute current streak
router.get("/streak", async (_req: Request, res: Response) => {
  try {
    const days = await DayLog.find({}).sort({ dateKey: -1 });
    let streak = 0;
    for (const day of days) {
      const total = day.habits.length;
      if (total === 0) break;
      const done = day.habits.filter((h) => h.done === true).length;
      if (done / total >= 0.5) streak++;
      else break;
    }
    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute streak" });
  }
});

// GET /api/days/:dateKey — get or create a day
router.get("/:dateKey", async (req: Request, res: Response) => {
  try {
    const { dateKey } = req.params;
    let day = await DayLog.findOne({ dateKey });

    if (!day) {
      // Carry habits from previous day if exists
      const prev = await DayLog.findOne({ dateKey: { $lt: dateKey } }).sort({
        dateKey: -1,
      });
      const habitNames = prev ? prev.habits.map((h) => h.name) : DEFAULT_HABITS;

      const [year, month, dayNum] = dateKey.split("-");
      const displayDate = `${dayNum}/${month}/${year}`;

      day = await DayLog.create({
        dateKey,
        displayDate,
        habits: habitNames.map((name, i) => ({
          id: uuid(),
          name,
          done: null,
          note: "",
          order: i,
        })),
        reflection: "",
        rating: 0,
      });
    }

    res.json(day);
  } catch (err) {
    res.status(500).json({ error: "Failed to get/create day" });
  }
});

// PATCH /api/days/:dateKey — update reflection or rating
router.patch("/:dateKey", async (req: Request, res: Response) => {
  try {
    const { dateKey } = req.params;
    const { reflection, rating, displayDate } = req.body;
    const update: Record<string, unknown> = {};
    if (reflection !== undefined) update.reflection = reflection;
    if (rating !== undefined) update.rating = rating;
    if (displayDate !== undefined) update.displayDate = displayDate;

    const day = await DayLog.findOneAndUpdate(
      { dateKey },
      { $set: update },
      { new: true }
    );
    if (!day) return res.status(404).json({ error: "Day not found" });
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: "Failed to update day" });
  }
});

// POST /api/days/:dateKey/habits — add a habit
router.post("/:dateKey/habits", async (req: Request, res: Response) => {
  try {
    const { dateKey } = req.params;
    let { name } = req.body;

    // Default name if empty
    name = (name || "").trim();
    if (!name) name = "New Habit"; // <-- Default fallback

    const day = await DayLog.findOne({ dateKey });
    if (!day) return res.status(404).json({ error: "Day not found" });
    if (day.habits.length >= 30)
      return res.status(400).json({ error: "Max 30 habits per day" });

    const newHabit = {
      id: uuid(),
      name: name,
      done: null,
      note: "",
      order: day.habits.length,
    };
    day.habits.push(newHabit);
    await day.save();
    res.json(day);
  } catch (err) {
    console.error("Error adding habit:", err); // Add this line
    res.status(500).json({ error: "Failed to add habit" });
  }
});

// PATCH /api/days/:dateKey/habits/:habitId — update a single habit
router.patch(
  "/:dateKey/habits/:habitId",
  async (req: Request, res: Response) => {
    try {
      const { dateKey, habitId } = req.params;
      const { name, done, note } = req.body;

      const day = await DayLog.findOne({ dateKey });
      if (!day) return res.status(404).json({ error: "Day not found" });

      const habit = day.habits.find((h) => h.id === habitId);
      if (!habit) return res.status(404).json({ error: "Habit not found" });

      if (name !== undefined) habit.name = name;
      if (done !== undefined) habit.done = done;
      if (note !== undefined) habit.note = note;

      await day.save();
      res.json(day);
    } catch (err) {
      res.status(500).json({ error: "Failed to update habit" });
    }
  }
);

// DELETE /api/days/:dateKey/habits/:habitId — remove a habit
router.delete(
  "/:dateKey/habits/:habitId",
  async (req: Request, res: Response) => {
    try {
      const { dateKey, habitId } = req.params;
      const day = await DayLog.findOne({ dateKey });
      if (!day) return res.status(404).json({ error: "Day not found" });

      day.habits = day.habits.filter((h) => h.id !== habitId);
      await day.save();
      res.json(day);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  }
);

// PUT /api/days/:dateKey/habits/reorder — reorder habits
router.put("/:dateKey/habits/reorder", async (req: Request, res: Response) => {
  try {
    const { dateKey } = req.params;
    const { orderedIds }: { orderedIds: string[] } = req.body;

    const day = await DayLog.findOne({ dateKey });
    if (!day) return res.status(404).json({ error: "Day not found" });

    const habitMap = new Map(day.habits.map((h) => [h.id, h]));
    day.habits = orderedIds
      .filter((id) => habitMap.has(id))
      .map((id, i) => ({ ...habitMap.get(id)!, order: i }));

    await day.save();
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: "Failed to reorder habits" });
  }
});

export default router;
