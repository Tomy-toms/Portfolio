import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { flattenErrors, projectSchema } from "@/lib/validators";
import { PROJECTS_TAG } from "@/lib/projects-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeUnpublished = searchParams.get("all") === "1";

  if (includeUnpublished) {
    const { error } = await requireAdmin();
    if (error) return error;
  }

  const where = includeUnpublished ? {} : { published: true };

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", fieldErrors: flattenErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.create({ data: parsed.data });
    revalidateTag(PROJECTS_TAG);
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "A project with this slug already exists." },
        { status: 409 }
      );
    }
    console.error("[projects:POST]", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
