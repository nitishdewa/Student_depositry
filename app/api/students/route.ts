import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';   // ✅ 3 levels up

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(students);
  } catch (error: any) {
    console.error('GET /api/students error:', error);  // terminal mein detail dikhegi
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, course, status } = body;

    if (!name || !email || !course || !status) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const newStudent = await prisma.student.create({
      data: { name, email, course, status },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/students error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A student with that email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create student', details: error.message },
      { status: 500 }
    );
  }
}