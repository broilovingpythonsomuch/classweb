import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all class structures
export async function GET() {
  try {
    const structures = await db.classStructure.findMany({
      orderBy: { order: "asc" },
      include: {
        children: true,
      },
    });
    return NextResponse.json(structures);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch class structures" },
      { status: 500 }
    );
  }
}

// CREATE new class structure
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, description, order, parentId } = body;

    const structure = await db.classStructure.create({
      data: {
        name,
        position,
        description,
        order: order || 0,
        parentId,
      },
    });

    return NextResponse.json(structure);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create class structure" },
      { status: 500 }
    );
  }
}
