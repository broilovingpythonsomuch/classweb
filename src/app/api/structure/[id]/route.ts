import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single class structure
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const structure = await db.classStructure.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!structure) {
      return NextResponse.json({ error: "Class structure not found" }, { status: 404 });
    }

    return NextResponse.json(structure);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch class structure" },
      { status: 500 }
    );
  }
}

// UPDATE class structure
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const structure = await db.classStructure.update({
      where: { id },
      data: {
        name: body.name,
        position: body.position,
        description: body.description,
        order: body.order,
        parentId: body.parentId,
      },
    });

    return NextResponse.json(structure);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update class structure" },
      { status: 500 }
    );
  }
}

// DELETE class structure
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.classStructure.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Class structure deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete class structure" },
      { status: 500 }
    );
  }
}
