import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all announcements
export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// CREATE new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, priority, isPinned, authorId } = body;

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        priority: priority || "normal",
        isPinned: isPinned || false,
        authorId,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
