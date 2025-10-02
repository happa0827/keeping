import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // ✅ params は Promise
) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // ✅ params を await してから展開
  const { id } = await context.params;
  const transactionId = Number(id);

  if (!transactionId || !userId) {
    return NextResponse.json({ error: "idとuserIdが必要です" }, { status: 400 });
  }

  try {
    const deleted = await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "削除できませんでした" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("取引削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
