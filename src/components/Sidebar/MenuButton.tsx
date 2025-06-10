"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuButtonProps {
    icon: string;
    title: string;
    path: string;
}
const MenuButton = ({ icon, title, path }: MenuButtonProps) => {

    const pathname = usePathname()
    const currentPath = pathname.split("/")[pathname.split("/").length - 1]

    return (
        <Link href={path} className={`flex rounded-r-3xl rounded-l-md text-white gap-4 items-center ${path === currentPath ? "bg-white/10 text-green-500" : "bg-dark-900/20"} p-2 hover:scale-105 duration-200 hover:text-green-3200 hover:animate-pulse`}>
            <div className="w-8 rounded-full h-8 border-green border">

            </div>
            <p>{title}</p>
        </Link>
    )
}

export default MenuButton