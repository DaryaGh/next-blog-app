import blogs from "@/data/blogs.json";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

export default function BlogDetails({ params }: Props) {

    // const decodedSlug = decodeURIComponent(params.slug);

    const blog = blogs.find(({ slug }) => slug === params.slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <Link
                    href="/blogs"
                    className="btn btn-outline-secondary d-flex align-items-center"
                    style={{ minWidth: "fit-content" }}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Blogs
                </Link>
                <h1 className="h3 mb-0 text-center flex-grow-1" style={{ minWidth: "min-content" }}>
                    {blog.title}
                </h1>
                <div style={{ width: "130px" }}></div>
            </div>

            <div className="row mb-4">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="d-flex align-items-center flex-wrap">
                        <strong className="me-2">Category:</strong>
                        <Link
                            href={`/blogs?category=${blog.category}`}
                            // href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                            className="btn btn-outline-primary btn-sm text-nowrap"
                        >
                            {blog.category}
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center flex-wrap">
                        <strong className="me-2">Tags:</strong>
                        <div className="d-flex flex-wrap gap-1">
                            {blog.tags.map((tag, index) => (
                                <Link
                                    key={index}
                                    href={`/blogs?tag=${tag}`}
                                    className="btn btn-outline-info btn-sm text-nowrap me-2"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    className="img-fluid rounded"
                    width={800}
                    height={400}
                    style={{ objectFit: "cover", width: "100%", height: "auto" }}
                />
            </div>
            {blog.gallery.length > 0 && (
                <div className="mb-5">
                    <h3 className="h5 mb-3">Gallery</h3>
                    <div className="row g-3">
                        {blog.gallery.map((img, index) => (
                            <div key={index} className="col-6 col-md-4 col-lg-3">
                                <Image
                                    src={img}
                                    alt={`${blog.title} - Image ${index + 1}`}
                                    className="img-fluid rounded"
                                    width={300}
                                    height={200}
                                    style={{ objectFit: "cover", width: "100%", height: "auto" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}