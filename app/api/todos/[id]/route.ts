import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// complete the todo
// /api/todos/todo_id_to_be_completed
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  try {
    const { completed } = await req.json();
    const todoId = params.id;

    const todo = await prisma.todo.findUnique({ where: { id: todoId } });

    if (!todo) {
      return NextResponse.json({ error: "todo not found" }, { status: 401 });
    }

    if (todo.userId !== userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { completed },
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("error updating todo", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

// /api/todos/todo_id_to_delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  try {
    const todoId = params.id;
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });

    if (!todo) {
      return NextResponse.json({ error: "todo not found" }, { status: 404 });
    }

    if (todo.userId !== userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    await prisma.todo.delete({ where: { id: todoId } });

    return NextResponse.json({
      message: "todo deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("error deleting todo", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
