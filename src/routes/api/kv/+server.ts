import { json } from "@sveltejs/kit";

import { KVCrudService, type User } from "../../../libs/kv/kvService.js";



export async function GET({ url, locals }) {
    try {

        if (!locals.KV) throw new Error("no kv found");
        const kv = locals.KV;

        const usersService = new KVCrudService<User>({
            kv,
            objectPrefix: 'users',
        })

        const users = await usersService.list()
        return json(
            {
                payload: users
            }
        )
    } catch (error) {
        return json({ error: error.message })
    }
}

export async function POST({ request, locals }) {
    try {
        if (!locals.KV) throw new Error("no kv found");
        const kv = locals.KV;

        const usersService = new KVCrudService<User>({
            kv,
            objectPrefix: 'users',
        })

        const { id, name }: { id: string, name: string } = await request.json();

        console.log(id);
        console.log(name);

        const result = await usersService.create({
            id: String(id),
            name
        })

        return json(
            {
                payload: result
            }
        )
    } catch (error) {
        return json({ error: error.message }, { status: 400 })
    }
}


