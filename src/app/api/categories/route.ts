import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const categories = await prisma.category.findMany({
        include: {
            blogs: {
                include: {
                    tags: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {name} = body;

    if (!name) {
        return NextResponse.json(
            {error: "Category name is required"},
            {status: 400}
        );
    }

    const newCategory = await prisma.category.create({
        data: {name},
        include: {
            blogs: true
        }
    });

    return NextResponse.json(newCategory, {status: 201});
}

export async function PUT(request: NextRequest) {

    const body = await request.json();
    const {id, name} = body;

    if (!id || !name) {
        return NextResponse.json(
            {error: "Both id and name are required"},
            {status: 400}
        );
    }

    const updatedCategory = await prisma.category.update({
        where: {id: Number(id)},
        data: {name},
        include: {
            blogs: true
        }
    });

    return NextResponse.json(updatedCategory);
}

export async function DELETE(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            {error: "Category ID is required"},
            {status: 400}
        );
    }

    await prisma.category.delete({
        where: {id: Number(id)},
    });

    return NextResponse.json(
        {message: "Category deleted successfully"},
        {status: 200}
    );
}