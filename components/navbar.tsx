import Link from "next/link";

const navItems = {
    "/petition": {
        name: "✍🏾 Sign Petition",
    },   
    "/": {
        name: "❔ About",
    },      
    "https://chatgpt.com/g/g-UvOnmgprA-kenya-law-guide": {
        name: "💬 KenyaLaw GPT",
    },       
};

export function Navbar() {
    return (
        <aside className="mb-12 mt-10 tracking-tight">
            <div className="lg:sticky lg:top-20">
                <nav
                    className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
                    id="nav"
                >
                    <div className="flex flex-row">
                        {Object.entries(navItems).map(([path, { name }]) => {
                            return (
                                <Link
                                    key={path}
                                    href={path}
                                    className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-1 mx-1"
                                >
                                    {name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </aside>
    );
}
