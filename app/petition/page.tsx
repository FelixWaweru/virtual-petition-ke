"use client";

import { Card } from "@/components/card";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import LoadMore from "./loadmore";
import { supabase } from '../../lib/db';

const PAGE_SIZE = 30;

export type PostsQuery = {
    "id": string;
    "message": string;
    "created_at": number;
    "signature": string;
    "name": string;
};

export default async function PetitionPage() {
    const [initialPosts, setInitialPosts] = useState<PostsQuery[]>([]);

    useEffect(() => {
        const fetchInitialPosts = async () => {
            let initialPostsFetch = await postsFetch(PAGE_SIZE);

            setInitialPosts(initialPostsFetch);
        };

        fetchInitialPosts();
    }, []);    

    async function postsFetch(fetchLimit: number){
        let { data: postQuery, error: postQueryError } = await supabase
            .from('signatures')
            .select("id, message, created_at, signature, name")
            .order("created_at",  { ascending: false })
            .limit(fetchLimit);

        if(!postQueryError && postQuery) {
            return postQuery as unknown as PostsQuery[];
        }

        return [];
    }

    const loadMorePosts = async (offset: number = 0) => {
        // Calculate the fetch limit based on the offset and PAGE_SIZE
        const fetchLimit = offset + PAGE_SIZE;
    
        const posts = await postsFetch(fetchLimit);
    
        // Calculate the next offset
        const nextOffset = posts.length >= PAGE_SIZE ? offset + PAGE_SIZE : null;
    
        // Slice the posts array to get only the new posts
        const newPosts = posts.slice(offset);
    
        return [
            // @ts-expect-error async RSC
            <PostCards offset={offset} posts={newPosts} key={offset} />,
            nextOffset,
        ] as const;
    };  

    return (
        <Suspense fallback={<Loading />}>
            <LoadMore loadMoreAction={loadMorePosts} initialOffset={PAGE_SIZE}>
                <PostCards posts={initialPosts} />
            </LoadMore>
        </Suspense>
        
    );
}

const PostCards = ({ posts }: { posts: PostsQuery[] }) => {
    return (
        <ul className="grid grid-cols-12 gap-5 mt-10">
            {posts.length !== 0 ? (
                posts.map((post) => (
                    <li key={post.id} className="flex col-span-12 sm:col-span-4">
                        <Card className="rounded-lg flex flex-col justify-between space-y-3 h-full">
                            <p className="leading-6 text-slate-900 dark:text-slate-50">{post.message}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex flex-col justify-end h-full text-sm">
                                    <p className="font-bold">{post.name}</p>
                                    <p>
                                        {new Date(post.created_at).toLocaleString("en-US", {
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
                ))
            ) : (
                <li className="flex col-span-12 sm:col-span-4">

                </li>
            )}
        </ul>
    );
};

