import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export async function GET(){
   const blogs = await prisma.blog.findMany({
       include:{tags:true , gallery:true },
   });
    return NextResponse.json(blogs)
}

export async function POST(request: NextRequest) {
        const body = await request.json();
        const { slug, title, summary, image, categoryId, content, tagIds } = body;

        if (!slug || !title) {
            return NextResponse.json(
                { error: "Slug and title are required" },
                { status: 400 }
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
                    connect: tagIds?.map((id: number) => ({ id })) || []
                },
            },
            include: {
                tags: true,
                gallery: true,
                category: true
            },
        });
        return NextResponse.json(newBlog, { status: 201 });
}

export async function PUT(request:NextRequest){
    const body = await request.json();
    const{id,...data}=body

    const updateBlog = await prisma.blog.update({
        where: { id:Number(id)},
        data,
    });
    return NextResponse.json(updateBlog,{status: 200});
}

export async function DELETE(request:NextRequest){
    const { searchParams} = new URL(request.url);
    const id = searchParams.get("id")

    //Validate ID

    await prisma.blog.delete({
        where: {id:Number(id)},
    });
    return NextResponse.json(
        {message:"Deleted blog with id "},
        {status:200}
    );
}