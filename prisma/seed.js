import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main() {
    await prisma.blogTags.deleteMany();
    await prisma.gallery.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.category.deleteMany();
    await prisma.tag.deleteMany();

    const category1 = await prisma.category.create({
        data: { name: "Programming" }
    });

    const category2 = await prisma.category.create({
        data: { name: "Web Development" }
    });

    const tag1 = await prisma.tag.create({data:{name:"Next.js"}});
    const tag2 = await prisma.tag.create({data:{name:"Prisma"}});
    const tag3 = await prisma.tag.create({data:{name:"Bootstrap"}});

    await prisma.blog.create({
        data:{
            title:"Getting Started with Next.JS and Prisma",
            slug: "getting-started-with-nextjs-prisma",
            summary: "Learn how to use Next.js with Prisma ORM",
            image: "/images/blog-1.jpg",
            content:"This is the full blog content for the Next.js + Prisma tutorial.",
            categoryId: category1.id,
            blogTags: {
                create: [
                    { tagId: tag1.id },
                    { tagId: tag2.id }
                ]
            },
            gallery: {
                create: [
                    {imageUrl: '/images/blog-2.jpg'},
                    {imageUrl: '/images/blog-3.jpg'},
                ],
            },
        },
    });

    await prisma.blog.create({
        data:{
            title:"Styling with bootstrap 5",
            slug: "styling-with-bootstrap-5",
            summary: "Learn Bootstrap 5 with Next.js",
            image: "/images/blog-4.jpg",
            content:"Learn Bootstrap with Next.js ....",
            categoryId: category2.id,
            blogTags: {
                create: [
                    { tagId: tag3.id }
                ]
            },
            gallery: {
                create: [
                    {imageUrl: '/images/blog-5.jpg'}
                ],
            },
        },
    });

    console.log("Seed completed successfully!");
}

main()
    .then(() => console.log("Database seeded successfully!"))
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });