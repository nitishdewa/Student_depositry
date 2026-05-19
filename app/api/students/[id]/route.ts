import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error: any) {
    console.error('GET [id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    const { name, email, course, status } = body;

    // Validation
    if (!name || !email || !course || !status) {
      return NextResponse.json(
        { error: 'All fields are required: name, email, course, status' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Attempt update (duplicate email handle ho jayega)
    const updated = await prisma.student.update({
      where: { id },
      data: { name, email, course, status },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('PUT [id] error:', error);

    // Unique constraint violation (email already exists)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Another student with that email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Update failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    // Check existence before delete
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ message: 'Student deleted' });
  } catch (error: any) {
    console.error('DELETE [id] error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error.message },
      { status: 500 }
    );
  }
}