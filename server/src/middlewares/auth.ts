import { Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

interface UserRequest extends Request {
    user?: JwtPayload | string;
}

export const requireSignIn = (req: UserRequest, res: Response, next: any) => {
    const token = req.cookies && req.cookies.token ? req.cookies.token : null;

    if (token === null) return res.sendStatus(401);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.sendStatus(500); // Internal Server Error if secret is not defined
    }

    verify(token, secret, (err: any, user: any) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user;

        next()
    })
};
