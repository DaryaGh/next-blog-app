import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();


export async function GET(){
   const blogs = await prisma.blog.findMany({
       include:{tags:true , gallery:true },
   });
    return NextResponse.json(blogs)
}

export async function POST(request:NextRequest){
    const body = await request.json();
    const{slug,title,summary,image,category,content,tags}=body

    const newBlog = await prisma.blog.create({
        data:{
            slug,
            title,
            content,
            summary,
            image,
            category,
            tags:{
                connect:tags?.map((tag:{id:number})=>({id:tag.id}))||[]
            },
        },
        include: {tags:true },
    });
    return NextResponse.json(newBlog,{status:201})
}

export async function PUT(request:NextRequest){
    const body = await request.json();
    const{id,...data}=body

    const updateBlog = await prisma.blog.update({
        where: { id:Number(id)},
        data,
    });
    return NextResponse.json(updateBlog);
}

export async function DELETE(request:NextRequest){
    const { searchParams} = new URL(request.url);
    const id = searchParams.get("id")

    await prisma.blog.delete({
        where: {id:Number(id)},
    });
    return NextResponse.json(
        {message:"Deleted blog with id "},
        {status:200}
    );
}