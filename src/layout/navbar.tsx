
'use client'
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@heroui/react";
import { MenuList } from "@/components/Sidebar/menulist";

export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

const CustomNavbar = () => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    return (
        <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={
            {
                base: "sm:backdrop-blur-none h-[74px] bg-dark-900 text-white shadow-md",
            }
        }>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <AcmeLogo />
                    <p className="font-bold text-inherit">FasaGame</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand>
                    <AcmeLogo />
                    <p className="font-bold text-inherit">FasaGame</p>
                </NavbarBrand>
                {/* <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="#">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem> */}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="danger" href="#" variant="flat" className="border border-red-500 text-white">
                        Connect
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="bg-dark-900/20 px-12 flex flex-col items-center justify-center gap-4">
                {MenuList.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`} className="w-1/2 bg-dark-500 py-2 px-4 rounded-lg">
                        <Link
                            className="text-white w-full hover:text-success-500"
                            color={
                                "foreground"
                            }
                            href={item.path}
                            size="lg"
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}

export default CustomNavbar;