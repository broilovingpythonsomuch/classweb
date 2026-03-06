import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all students
export async function GET() {
  try {
    const students = await db.student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// CREATE new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      studentId,
      className,
      address,
      birthDate,
      gender,
      avatar,
      status,
    } = body;

    const existingStudent = await db.student.findUnique({
      where: { studentId },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student with this ID already exists" },
        { status: 400 }
      );
    }

    const student = await db.student.create({
      data: {
        name,
        email,
        phone,
        studentId,
        className,
        address,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        avatar,
        status: status || "active",
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
