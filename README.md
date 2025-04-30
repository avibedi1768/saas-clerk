This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## prisma

`npm install prisma --save-dev`
<br/>
`npx prisma init --datasource-provider postgresql`
<br/>

## prisma format

`npx prisma format`

## send to neon db

`npx prisma migrate dev --name init` -> better <br/>
or <br/>
`npx prisma db push` <br/>

## generates prisma client in the node mudules

`npm install @prisma/client` <br/>
`npx prisma generate`

## the reference from prisma official repo:

`https://github.com/prisma/prisma-examples/tree/latest/orm/clerk-nextjs` <br/>
`https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql?utm_source=website&utm_medium=postgres-page` <br/>

## clerk setup

`npm install @clerk/nextjs`

## shadcn

`npx shadcn@latest add card` <br/>
`npx shadcn@latest add button` <br/>
`npx shadcn@latest add input` <br/>
`npx shadcn@latest add progress` <br/>
`npx shadcn@latest add label` <br/>
`npx shadcn@latest add alert` <br/>

## lucide react for icons

`npm i lucide-react`

## for svix for webhooks

`npm install svix` <br/>
`https://docs.svix.com/receiving/verifying-payloads/how`

## localtunnel installed globally for webhooks (for providing the IP instead of localhost)

`npm install -g localtunnel` <br/>
`lt --port 3000`

## route accumulator

/app/(authenticated) -> a collection of routes. not a route

## usehooks

https://usehooks-ts.com/introduction <br/>
`npm install usehooks-ts`

## self

/(authenticated)/subscribe <br/>
/api/admin -> list all users. in each user, access the list of his todos -> CRUD <br/>
add some AI <br/>
import the whole code from prisma -> drizzle
