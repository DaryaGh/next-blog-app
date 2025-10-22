import Link from "next/link";

export default function NavBar() {
    return(
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container">
                <Link className="navbar-brand" href="/">Navbar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/about-us">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/contact-us">Contact Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/blogs">Blogs</Link>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    )
}