import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { flattenErrors, projectSchema } from "@/lib/validators";
import { PROJECTS_TAG } from "@/lib/projects-data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!project.published) {
    const { error } = await requireAdmin();
    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = projectSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", fieldErrors: flattenErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: parsed.data,
    });
    revalidateTag(PROJECTS_TAG);
    return NextResponse.json({ project });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "Slug already in use." },
          { status: 409 }
        );
      }
    }
    console.error("[projects:PATCH]", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    revalidateTag(PROJECTS_TAG);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[projects:DELETE]", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
