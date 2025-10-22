import {NextResponse, NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
    params: {
        slug: string;
    };
}

export async function GET(request: NextRequest, {params}: Params) {

    const blog = await prisma.blog.findUnique({
        where: {slug: params.slug},
        include: {
            tags: true,
            gallery: true,
            category: true
        },
    });

    if (!blog) {
        return NextResponse.json({error: 'Blog not found'}, {status: 404});
    }

    return NextResponse.json(blog);
}

export async function POST(request: NextRequest, {params}: Params) {

    const body = await request.json();
    const {title, summary, image, content, categoryId, tagIds, gallery} = body;

    if (!title || !content) {
        return NextResponse.json(
            {error: "Title and content are required"},
            {status: 400}
        );
    }

    const existingBlog = await prisma.blog.findUnique({
        where: {slug: params.slug}
    });

    if (existingBlog) {
        return NextResponse.json(
            {error: "Blog with this slug already exists"},
            {status: 409}
        );
    }

    const newBlog = await prisma.blog.create({
        data: {
            slug: params.slug,
            title,
            summary,
            image,
            content,
            categoryId: categoryId ? Number(categoryId) : null,
            tags: {
                connect: tagIds?.map((id: number) => ({id})) || []
            },
            gallery: {
                create: gallery?.map((item: { imageUrl: string }) => ({
                    imageUrl: item.imageUrl
                })) || []
            }
        },
        include: {
            tags: true,
            gallery: true,
            category: true
        },
    });

    return NextResponse.json(newBlog, {status: 201});
}

export async function PUT(request: NextRequest, {params}: Params) {

    const body = await request.json();
    const {title, content, categoryId, tagIds} = body;

    const updatedBlog = await prisma.blog.update({
        where: {slug: params.slug},
        data: {
            title,
            content,
            categoryId: categoryId ? Number(categoryId) : null,
            tags: {
                set: [], // حذف همه تگ‌های فعلی
                connect: tagIds?.map((id: number) => ({id})) || [] // اضافه کردن تگ‌های جدید
            },
        },
        include: {
            tags: true,
            gallery: true,
            category: true
        },
    });

    return NextResponse.json(updatedBlog);

}

export async function DELETE(request: NextRequest, {params}: Params) {

    await prisma.blog.delete({
        where: {slug: params.slug},
    });

    return NextResponse.json(
        {message: "Blog deleted successfully"},
        {status: 200}
    );

}