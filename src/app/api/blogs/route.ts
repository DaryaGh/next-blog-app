import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export async function GET() {
    const blogs = await prisma.blog.findMany({
        include: {tags: true, gallery: true},
    });
    return NextResponse.json(blogs)
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {slug, title, summary, image, categoryId, content, tagIds} = body;

    if (!slug || !title) {
        return NextResponse.json(
            {error: "Slug and title are required"},
            {status: 400}
        );
    }
    const newBlog = await prisma.blog.create({
        data: {
            slug,
            title,
            content,
            summary,
            image,
            categoryId: categoryId ? Number(categoryId) : null,
            tags: {
                connect: tagIds?.map((id: number) => ({id})) || []
            },
        },
        include: {
            tags: true,
            gallery: true,
            category: true
        },
    });
    return NextResponse.json(newBlog, {status: 201});
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const {id, ...data} = body

    const updateBlog = await prisma.blog.update({
        where: {id: Number(id)},
        data,
    });
    return NextResponse.json(updateBlog, {status: 200});
}

export async function DELETE(request: NextRequest) {

    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id");

    // VALIDATION
    if (!id) {
        return NextResponse.json(
            {error: "Blog ID is required"},
            {status: 400}
        );
    }

    const numericId = Number(id);
    if (isNaN(numericId) || numericId <= 0) {
        return NextResponse.json(
            {error: "Invalid blog ID. ID must be a positive number"},
            {status: 400}
        );
    }

    const existingBlog = await prisma.blog.findUnique({
        where: {id: numericId},
        include: {
            gallery: true,
            blogTags: true
        }
    });

    if (!existingBlog) {
        return NextResponse.json(
            {error: "Blog not found"},
            {status: 404}
        );
    }

    await prisma.blog.delete({
        where: {id: numericId},
    });

    return NextResponse.json(
        {
            message: "Blog deleted successfully",
            deletedBlog: {
                id: existingBlog.id,
                title: existingBlog.title,
                slug: existingBlog.slug
            }
        },
        {status: 200}
    );

}