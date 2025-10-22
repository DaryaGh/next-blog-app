import {NextResponse,NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client" ;

const prisma = new PrismaClient();

export async function GET(request:NextRequest, {params}:{params:{slug:string}}) {
    const blog = await prisma.blog.findUnique({
        where: {slug:params.slug},
        include: {tags: true,gallery:true},
    });
    if (!blog) return NextResponse.json({error: 'Not found'}, {status: 404})
    return NextResponse.json(blog)
}


export async function PUT(request:NextRequest, {params}:{params:{slug:string}}) {
    const body = await request.json();
    const {title, content, category} = body;
    const blog = await prisma.blog.update({
        where: {slug:params.slug},
        data: {
            title,
            content,
            category,
            tags: {
                deleteMany: {}, //Remove old
                // create: tagIds.map((id) => ({tagId: id})), //Add new
            },
        },
        include: {},
    });
    return NextResponse.json(blog)
}

// export async function POST(request:NextRequest, {params}:{params:{slug:string}}) {
//
//     const body = await request.json();
//     const {title, content, categoryId, tagIds} = body;
//
//     const blog = await prisma.blog.create({
//         data: {
//             title,
//             content,
//             categoryId,
//             tags: {
//                 create: tagIds.map((id) => ({tagId: id})),
//             },
//         },
//         include: {category: true, tags: {include: {tag: true}}},
//     });
//
//     return NextResponse.json(blog, {status: 201});
//
// }
//
// export async function DELETE(request, {params}) {
//
//     const existingBlog = await prisma.blog.findUnique({
//         where: {id: parseInt(params.id)}
//     });
//
//     if (!existingBlog) {
//         return NextResponse.json(
//             {error: 'بلاگ پیدا نشد'},
//             {status: 404}
//         );
//     }
//
//     await prisma.blog.delete({
//         where: {id: parseInt(params.id)},
//     });
//
//     return NextResponse.json(
//         {message: 'بلاگ با موفقیت حذف شد'},
//         {status: 200}
//     );
//
// }
