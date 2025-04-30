// endpoint = example.com/api/webhook/register
// but webhooks need IP address -> use ngrok or localtunnel

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("please add webhook secret in the env");
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured - No Svix headers");
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error: unknown) {
    console.error("error verifying webhook", error);
    return new Response("error verifying webhook", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  // logs
  if (eventType === "user.created") {
    try {
      const {
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name,
      } = evt.data;
      // log practice
      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      if (!primaryEmail) {
        return new Response("no primary email found", { status: 400 });
      }

      // create a user in neon (postgresql)
      const newUser = await prisma.user.create({
        data: {
          id: evt.data.id!,
          email: primaryEmail.email_address,
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          isSubscribed: false,
        },
      });

      console.log("new user created", newUser);
    } catch (error) {
      return new Response("error creating user in database", { status: 400 });
    }
  }

  return new Response("webhook received successfull", { status: 200 });
}

/**
 * "svix-id": "msg_p5jXN8AQM9LWM0D4loKWxJek",
  "svix-timestamp": "1614265330",
  "svix-signature": "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
 */
