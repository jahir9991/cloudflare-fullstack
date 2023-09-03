import type { Handle } from "@sveltejs/kit";
import { drizzle } from "drizzle-orm/d1";
import { SERVER_ENV } from "./SERVER_ENV";
import { createBridge } from "cfw-bindings-wrangler-bridge";
import { ConnectSupabasePg } from "./db/connectSupabasePg";
import { ConnectNeonPg } from "./db/connectNeonPg";

const hostname = SERVER_ENV.PROXY_HOST;

const injectD1 = async (event) => {

  try {
    if (event.platform?.env?.DB) {
      event.locals.DB = drizzle(event.platform?.env?.DB)
    } else {

      //local
      // event.locals.DB = (await import(SERVER_ENV.LOCAL_D1_PATH)).default

      //bridge
      const bridge = createBridge(hostname);
      event.locals.DB = drizzle(bridge.D1Database('DB'))
    }

  } catch (error) {
    console.log("🚀 ~ file: hooks.server.ts:27 ~ consthandle:Handle= ~ error:", error)

  }


}


const injectKV = async (event) => {

  try {
    if (event.platform?.env?.KV) {
      event.locals.KV = event.platform?.env?.KV
    } else {
      //bridge
      const bridge = createBridge(hostname);
      event.locals.KV = bridge.KVNamespace('KV');
    }

  } catch (error) {
    console.log("🚀 ~ file: hooks.server.ts:50 ~ consthandle:Handle= ~ error:", error)

  }


}

const injectDbSupabase = async (event) => {

  try {
    event.locals.DB_SUPABASE_PG = ConnectSupabasePg()

  } catch (error) {
    console.log("🚀 ~ file: hooks.server.ts:64 ~ consthandle:Handle= ~ error:", error)
  }
}

const injectDbNeon = async (event) => {

  try {
    event.locals.DB_NEON_PG = await ConnectNeonPg()

  } catch (error) {
    console.log("🚀 ~ file: hooks.server.ts:69 ~ consthandle:Handle= ~ error:", error)
  }
}



export const handle: Handle = async ({ event, resolve }) => {

  if (event.url.pathname.startsWith('/api/kv')) {

    await injectKV(event);

  } else if (event.url.pathname.startsWith('/api/pg')) {

    await injectDbSupabase(event);
  } else if (event.url.pathname.startsWith('/api/supabase')) {

    await injectDbSupabase(event);
  } else if (event.url.pathname.startsWith('/api/neon')) {

    await injectDbNeon(event);
  } else if (event.url.pathname.startsWith('/api/d1')) {
    await injectD1(event);
  }



  if (event.url.pathname.startsWith('/api') && event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    });
  }

  const response = await resolve(event);

  if (event.url.pathname.startsWith('/api')) {
    response.headers.append('Access-Control-Allow-Origin', `*`);
  }
  return response;
}

