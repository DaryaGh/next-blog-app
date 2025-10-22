"use client";

import blogsData from "@/data/blogs.json"
import Link from "next/link"
import Image from "next/image"
import {Blog, Category, Tag} from '@/types/blog'
import {useState, useEffect} from "react";
import {useSearchParams , useRouter,usePathname} from "next/navigation";


const blogs: Blog[] = blogsData

export default function Blogs() {

    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();

    const querySearch = searchParams.get("search") || "";
    const queryCategory = searchParams.get("category") || "All";
    const queryTag = searchParams.get("tag") || "All";


    const [search, setSearch] = useState(querySearch)

    // const [category, setCategory] = useState<Category>('All')
    const [category, setCategory] = useState<Category>(queryCategory);


    // const [tag, setTag] = useState<Tag>('All')
    const [tag, setTag] = useState<Tag>(queryTag);


    useEffect(()=> {
        setSearch(querySearch)
        setCategory(queryCategory)
        setTag(queryTag)
    } , [querySearch, queryCategory, queryTag])

    const updateQueryParams = (newSearch: string,newCategory:string,newTag:string ) => {
        const params = new URLSearchParams()

        if (newSearch) params.set("search", newSearch)
        if (newCategory !== "All") params.set("category", newCategory)
        if (newTag !== "All") params.set("tag", newTag)

        router.push(`${pathname}?${params.toString()}`)

    }

    const categories = ['All', ...new Set(blogs.map(blog => blog.category))]

    const tags = ['All', ...new Set(blogs.flatMap(blog => blog.tags))]

    const filteredBlogs = blogs.filter(blog => {

        const matchesSearch =
            blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.summary.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = category === 'All' || blog.category === category

        const matchesTag = tag === 'All' || blog.tags.includes(tag)

        return matchesSearch && matchesCategory && matchesTag;
    });


    const handleClear = () => {
        setCategory('All');
        setTag('All');
        setSearch('')
        router.push('/blogs');
    }

    // هایلات کردن خطوط

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;

        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase()
                ?
                <mark key={i} style={{backgroundColor: '#ffeb3b', padding: '0 2px', borderRadius: '3px'}}>{part}</mark>
                : part
        );
    };

    return (
        <div className='mb-5'>
            <h1>
                <i className='bi bi-journal-text me-2'></i>
                All Blogs
            </h1>

            <div className="row mb-4 align-items-end">
                <div className="col-lg-3 col-md-3 mb-2">
                    <label className='form-label'>Search by Title or Summary</label>
                    <input
                        type="text"
                        placeholder="Search Blog by Title or Summary"
                        className='form-control'
                        value={search}
                        onChange=
                            {(e) => {
                                setSearch(e.target.value)
                                updateQueryParams(e.target.value,category,tag)
                    }}

                    />
                </div>

                <div className="col-lg-3 col-md-3 mb-2">
                    <label className='form-label'>Categories</label>
                    <select
                        className='form-select'
                        value={category}
                        onChange=
                            {(e) => {
                                setCategory(e.target.value)
                                updateQueryParams(search,e.target.value,tag)
                            }}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="col-lg-3 col-md-3 mb-2">
                    <label className='form-label'>Tags</label>
                    <select
                        className='form-select'
                        value={tag}
                        onChange=
                            {(e) => {
                                setTag(e.target.value)
                                updateQueryParams(search,category,e.target.value)
                            }}
                    >
                        {tags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                <div className='col-lg-3 col-md-3 mb-2'>
                    <button
                        className="btn btn-outline-danger w-100"
                        onClick={handleClear}
                        disabled={category === 'All' && tag === 'All' && search === ''}
                    >
                        <i className="bi bi-trash"></i>{" "}
                        <span className="d-none d-md-inline"> Clear Filters</span>
                    </button>
                </div>
            </div>

            <div className="row">
                {filteredBlogs.length > 0
                    ?
                    (
                        filteredBlogs.map((blog) => (
                            <div key={blog.id} className='col-lg-4 col-md-6  mb-4'>
                                <div className='card h-100 shadow-sm'>
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        width={400}
                                        height={250}
                                        style={{objectFit: "cover"}}
                                        className="card-img-top"
                                    />
                                    <div className='card-body d-flex flex-column'>
                                        <h5 className='card-title'>
                                            {/*{blog.title}*/}
                                            {highlightText(blog.title, search)}
                                        </h5>
                                        <p className='card-text'>
                                            {/*{blog.summary}*/}
                                            {highlightText(blog.summary, search)}
                                        </p>
                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className='btn btn-primary mt-auto'
                                        >
                                            <i className='bi bi-box-arrow-in-right me-1'></i>
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                    :
                    (
                        <div className='alert alert-warning'>
                            <i className='bi bi-exclamation-triangle me-2'></i>
                            No blogs found.
                        </div>
                    )
                }
            </div>

        </div>
    );
}