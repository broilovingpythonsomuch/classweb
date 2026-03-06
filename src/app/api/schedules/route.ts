import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all schedules
export async function GET() {
  try {
    const schedules = await db.schedule.findMany({
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

// CREATE new schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subject,
      day,
      startTime,
      endTime,
      room,
      teacherName,
      color,
    } = body;

    const schedule = await db.schedule.create({
      data: {
        title,
        subject,
        day,
        startTime,
        endTime,
        room,
        teacherName,
        color: color || "#6366f1",
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}
