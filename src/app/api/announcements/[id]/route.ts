import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single announcement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const announcement = await db.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    );
  }
}

// UPDATE announcement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const announcement = await db.announcement.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        priority: body.priority,
        isPinned: body.isPinned,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
