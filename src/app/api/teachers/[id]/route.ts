import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single teacher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await db.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teacher" },
      { status: 500 }
    );
  }
}

// UPDATE teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const teacher = await db.teacher.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        position: body.position,
        avatar: body.avatar,
        bio: body.bio,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

// DELETE teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.teacher.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
