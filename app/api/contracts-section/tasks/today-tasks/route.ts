import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
	try {
		console.log("Fetching today's tasks...");

		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const endOfToday = new Date(startOfToday);
		endOfToday.setHours(23, 59, 59, 999);

		const tasksToday = await prisma.task.findMany({
			where: {
				time: {
					gte: startOfToday.toISOString(),
					lte: endOfToday.toISOString(),
				},
			},
		});

		console.log("Tasks fetched:", tasksToday);

		return NextResponse.json(
			{
				success: true,
				massage: "Tasks fetched successful",
				tasks: tasksToday,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching today's tasks:", error);
		return NextResponse.json(
			{
				success: false,
				massage: "Failed to fetch today tasks",
			},
			{ status: 400 }
		);
	} finally {
		console.log("Closing database connection...");
		await prisma.$disconnect();
	}
};
