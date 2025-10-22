import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const blogs = await prisma.tag.findMany({
        include: {blogs: true}
    });
    return NextResponse.json(blogs, {status: 200});
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {name} = body;
    const newTag = await prisma.tag.create({data: {name}});
    return NextResponse.json(newTag, {status: 201});
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const {id, name} = body;

    //Basic Validation
    if (!id || !name) {
        return NextResponse.json(
            {error: "Both id and name is required"},
            {status: 400}
        );
    }

    //Update Tag
    //UPDATE tags set name = rew.name WHERE id = req.id
    const updatedTag = await prisma.tag.update({
        data: {id: id, name}
        , where: {id: id}
    });
    return NextResponse.json(updatedTag, {status: 200})
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const {id} = body;

    //Validate input
    if (!id) {
        return NextResponse.json(
            {error: "Tag id is required"},
            {status: 400}
        );
    }

    //Delete the tag
    //DELETE from tags WHERE id = req.id
    const deletedTag = await prisma.tag.delete({
        where: {id},
    });

    return NextResponse.json(
        {message: "Tag is deleted successfully.", deletedTag},
        {status: 200}
    )
}