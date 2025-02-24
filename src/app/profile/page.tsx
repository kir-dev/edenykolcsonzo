import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function ProfilePage() {
    const session = await getServerAuthSession();
    
    if (!session || !session.user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col items-center justify-cente">
            <div className="rounded-4xl bg-gray-200 p-3.5 dark:bg-gray-800">
                <h2 className="flex flex-row p-2 justify-center"><UserRound />Profile</h2>
                <p className="flex justify-center">{session.user.name}</p>
                <p className="flex flex-row p-2 justify-center">{session.user.role}</p>
                <p className="flex justify-center">Aktív rendeléseim</p>
                <Link href="/api/auth/signout" className="rounded-4xl bg-gray-500 p-3 flex flex-row gap-2 hover:bg-gray-600 transition-all"><LogOut />Kijelentkezés</Link>
            </div>
        </div>
    );
}
