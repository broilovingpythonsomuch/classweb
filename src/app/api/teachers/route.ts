import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all teachers
export async function GET() {
  try {
    const teachers = await db.teacher.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

// CREATE new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, position, avatar, bio } = body;

    const teacher = await db.teacher.create({
      data: {
        name,
        email,
        phone,
        subject,
        position,
        avatar,
        bio,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
