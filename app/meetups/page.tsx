import { MotionDiv } from "@/components/motion";
import { Microphone } from "@/components/ui/Mic";
import { Pen } from "@/components/ui/Pen";
import { formatDistance } from "date-fns";
import React from "react";

const meetups = [
    {
        name: "TBD",
        date: "2024-06-25",
        event: "#RejectFinanceBill2024",
        location: "Nairobi, Kenya",
    },
];

const childVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TalksPage() {
    return (
        <MotionDiv variants={childVariants}>
            <div>
                <span className="text-xl flex gap-2 items-center my-6 cursor-pointer">
                    <Microphone size={19} />
                    Meetups
                </span>

                {meetups.map((meetup, index) => (
                    <div key={index} className="mb-8">
                        <div className="flex justify-between items-start">
                            <h2 className="text-lg  decoration-grey-100 hover:decoration-1 mb-1">{meetup.name}</h2>
                            <span className="text-sm">
                                {formatDistance(new Date(meetup.date), new Date(), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                        {meetup.location && (
                            <div className="flex gap-2">
                                <p className="text-sm text-slate-400">
                                    {meetup.event} ({meetup.location})
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </MotionDiv>
    );
}
