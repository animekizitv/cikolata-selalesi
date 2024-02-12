import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

import Joi from "joi";
import validate from "@/util/middlewares/validate";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";



const schema = Joi.object({
    content: Joi.string().required(),
    attachments: Joi.array().optional().items(Joi.string().optional())
})

type PostRequest = {
    content: string,
    attachments: string[]
}

export default validate({body: schema}, async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method !== "POST") {
        return res.status(405).json({
            status: false,
            message: "Method Not Allowed"
        })
    }

    try {
        const request = req.body as PostRequest;
        
        const post = await prisma.user.createPost({
            session: await getServerSession(req, res, authOptions),
            content: request.content
        })

        return res.json({
            status: true,
            post: post
        })
    } catch(err) {
        if(err instanceof Error) {
            res.status(500).json({
                status: false,
                error: err.message
            })
        }

        console.error(err);
    }
});