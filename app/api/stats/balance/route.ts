import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { get } from "http";
import getBaseWebpackConfig from "next/dist/build/webpack-config";
import { redirect } from "next/navigation"

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");


    const queryParams = OverviewQuerySchema.safeParse({ from, to })

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400,
        })
    }
    const stats = await getBalenceStats(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    );
    return Response.json(stats);
}

export type GetBalanceStatsResponseType = Awaited<
    ReturnType<typeof getBalenceStats
    >>
async function getBalenceStats(userId: string, from: Date, to: Date) {
    const totals = await prisma.transaction.groupBy(
        {
            by: ["type"],
            where: {
                userId,
                date: {
                    gte: from,
                    lte: to
                }
            },
            _sum: {
                amount: true
            }
        }
    );
    return  {
        depense : totals.find((t) => t.type === "depense")?._sum.amount || 0,
        revenue : totals.find((t) => t.type === "revenue")?._sum.amount || 0
    }

}