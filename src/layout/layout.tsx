import CustomNavbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex flex-col min-h-screen bg-no-repeat bg-center">
            <CustomNavbar />
            <main className="flex-grow bg-dark-500 flex">
                <Sidebar />
                {children}
            </main>
            <footer className="bg-dark-900 text-white p-4 text-center">
                <p>&copy; 2025 www.fasagame.com</p>
            </footer>
        </div>
    )
}


export default Layout;