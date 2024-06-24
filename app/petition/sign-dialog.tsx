"use client";

import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { SignaturePad, cn } from "@/components/signature-pad";
import { Textarea } from "@/components/textarea";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/db";


export const SignDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [localSignature, setLocalSignature] = useState<string>("");
    const [textInvalid, setTextInvalid] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [user, setUser] = useState<any>("");
    
    useEffect(() => {
        let userData = localStorage.getItem("session") ? (localStorage.getItem("session") as string) : "";

        if (userData !== "" ) {
            userData = JSON.parse(userData);
        }

        setUser(userData);
      }, []);    


    const sign = async (formData: FormData) => {
          
        const name = formData.get("name") as string;
        const message = formData.get("message") as string;
        const signature = formData.get("signature") as string;
    
        if (user == "") {
            return;
        }
    
        let { data: postQuery, error: postQueryError } = await supabase
            .from('signatures')
            .select("id")
            // Filters
            .eq('user_id', user?.user.id);
    
        if(!postQueryError && postQuery) {
            if (postQuery?.length) {
                throw new Error("You have already signed the petition");
            }
        }
    
        let { data: newSignature, error: newSignatureError } = await supabase
            .from('signatures')
            .insert([{
                user_id: user?.user.id,
                name: name,
                message: message,
                signature: signature,
                petition_name: "RejectFinanceBill2024"
        }]);
    
        if(!newSignatureError && newSignature) {
            window.location.reload();
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);

        if (!formData.get("message")) {
            setTextInvalid(true);
            setIsOpen(true);

            toast.error("Please enter a message");
            setFormLoading(false);
            return;
        }

        if (!formData.get("name")) {
            setTextInvalid(true);
            setIsOpen(true);

            toast.error("Please enter your Name");
            setFormLoading(false);
            return;
        }        

        formData.append("signature", localSignature);

        try {
            await sign(formData);
            setIsOpen(false);
            setFormLoading(false);
        } catch (err: any) {
            toast.error(err.message);
            setIsOpen(false);
            setFormLoading(false);
        }
    };

    return (
        <>
            <Button type="button" onClick={() => setIsOpen(true)}>
                📝 Add your signature
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Sign petition</DialogTitle>

                    <DialogBody className="space-y-4">
                        <Field>
                            <Label>Your Name</Label>
                            <Textarea invalid={textInvalid} rows={1} maxLength={150} name="name" />
                        </Field>                        
                        <Field>
                            <Label>Leave a message</Label>
                            <Textarea invalid={textInvalid} rows={3} name="message" />
                        </Field>
                        <Field>
                            <Label>Sign Here</Label>
                            <SignaturePad
                                className={cn(
                                    "aspect-video h-40 mt-2 w-full rounded-lg border bg-transparent shadow dark:shadow-none",
                                    "border border-grey-950/10 dark:border-black/10 ",
                                    "bg-transparent dark:bg-black/5"
                                )}
                                onChange={(value) => setLocalSignature(value ?? "")}
                            />
                        </Field>
                    </DialogBody>
                    <DialogActions>
                        <Button plain onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={formLoading} type="submit">
                            Sign
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};
