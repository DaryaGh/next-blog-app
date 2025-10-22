import {NextResponse, NextRequest} from "next/server";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export async function GET() {
    const gallery = await prisma.gallery.findMany({
        include: {
            blog: {
                include: {
                    tags: true,
                    category: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });
    return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {imageUrl, blogId} = body;

    if (!imageUrl || !blogId) {
        return NextResponse.json(
            {error: "imageUrl and blogId are required"},
            {status: 400}
        );
    }

    const newGallery = await prisma.gallery.create({
        data: {
            imageUrl,
            blogId: Number(blogId)
        },
        include: {
            blog: true
        }
    });
    return NextResponse.json(newGallery, {status: 201});
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const {id, imageUrl, blogId} = body;

    if (!id || !imageUrl || !blogId) {
        return NextResponse.json(
            {error: "id, imageUrl and blogId are required"},
            {status: 400}
        );
    }

    const updatedGallery = await prisma.gallery.update({
        where: {id: Number(id)},
        data: {
            imageUrl,
            blogId: Number(blogId)
        },
        include: {
            blog: true
        }
    });

    return NextResponse.json(updatedGallery);
}

export async function DELETE(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            {error: "Gallery ID is required"},
            {status: 400}
        );
    }

    await prisma.gallery.delete({
        where: {id: Number(id)},
    });

    return NextResponse.json(
        {message: "Gallery item deleted successfully"},
        {status: 200}
    );
}