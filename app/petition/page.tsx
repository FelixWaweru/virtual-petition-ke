import { db } from "@/lib/db";
import { Card } from "@/components/card";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "./loading";
import LoadMore from "./loadmore";
import { supabase } from '../../lib/db'
import { auth } from "@/lib/auth";

const PAGE_SIZE = 50;

export type PostsQuery = {
    id: string;
    message: string;
    created_at: number;
    signature: string;
    username: string;
    name: string;
};

async function postsFetch(){
    const { user } = await auth();

    if (!user.id) {
        // return
    }
    else if(user.id) {
        let { data: user_history, error } = await supabase
            .from('user_history')
            .select("id, user_id, prompt, response, created_at")
            // Filters
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(PAGE_SIZE);
        
        if(!error) {
            // setUserHistory(user_history || [])
            return user_history.rows as unknown as PostsQuery[];
        }
    }
    else {
    // Pass
    }
}

const getPosts = async (offset: number) => {
    const postsQuery = await db.execute({
        sql: `SELECT post.*, user.username, user.name FROM post JOIN user ON post.user_id = user.id ORDER BY post.created_at DESC LIMIT 50 OFFSET ?`,
        args: [offset],
    });
    return postsQuery.rows as unknown as PostsQuery[];
};

const loadMorePosts = async (offset: number = 0) => {
    "use server";
    const posts = await getPosts(offset);
    const nextOffset = posts.length >= PAGE_SIZE ? offset + PAGE_SIZE : null;

    return [
        // @ts-expect-error async RSC
        <PostCards offset={offset} posts={posts} key={offset} />,
        nextOffset,
    ] as const;
};

export default async function GuestbookPage() {

    const intialPosts = await getPosts(0);

    return (
        <Suspense fallback={<Loading />}>
            {/* <ul className="grid grid-cols-12 gap-5 mt-10">
                {posts.map((post) => (
                    <li key={post.id} className="flex col-span-12 sm:col-span-6">
                        <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
                            <p className="leading-6 text-grey-900 dark:text-grey-50">{post.message}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex flex-col justify-end h-full text-sm">
                                    {post.name ? (
                                        <p className="font-bold">{post.name}</p>
                                    ) : (
                                        <p className="font-bold">@{post.username}</p>
                                    )}

                                    <p>
                                        {new Date(post.created_at * 1000).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </p>
                                </div>
                                {post.signature && (
                                    <div className="dark:invert -mb-4 -mr-4">
                                        <Image alt="signature" src={post.signature} width={150} height={150} />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </li>
                ))}
            </ul> */}
            <LoadMore loadMoreAction={loadMorePosts} initialOffset={PAGE_SIZE}>
                <PostCards posts={intialPosts} />
            </LoadMore>
        </Suspense>
    );
}

const PostCards = ({ posts }: { posts: PostsQuery[] }) => {
    return (
        <ul className="grid grid-cols-12 gap-5 mt-10">
            {posts.map((post) => (
                <li key={post.id} className="flex col-span-12 sm:col-span-6">
                    <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
                        <p className="leading-6 text-grey-900 dark:text-grey-50">{post.message}</p>

                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-col justify-end h-full text-sm">
                                {post.name ? (
                                    <p className="font-bold">{post.name}</p>
                                ) : (
                                    <p className="font-bold">@{post.username}</p>
                                )}

                                <p>
                                    {new Date(post.created_at * 1000).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </p>
                            </div>
                            {post.signature && (
                                <div className="dark:invert -mb-4 -mr-4">
                                    <Image alt="signature" src={post.signature} width={150} height={150} />
                                </div>
                            )}
                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    );
};
