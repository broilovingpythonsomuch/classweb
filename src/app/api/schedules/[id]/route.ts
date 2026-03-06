import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schedule = await db.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

// UPDATE schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const schedule = await db.schedule.update({
      where: { id },
      data: {
        title: body.title,
        subject: body.subject,
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        room: body.room,
        teacherName: body.teacherName,
        color: body.color,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}

// DELETE schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.schedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}
