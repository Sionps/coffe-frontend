'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  Home,
  Milk,
  CakeSlice,
  CupSoda,
  Coffee,
  RockingChair,
  CalendarDays,
  ChartColumnStacked 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("next_name");
        localStorage.removeItem("next_user_id");

        Swal.fire('Logged out!', 'You have been successfully logged out.', 'success').then(() => {
          router.push("/signup");
        });
      }
    });
  };

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 w-64 flex flex-col items-center bg-gray-800 text-white py-6 shadow-lg">
        <div className="flex h-20 w-full items-center justify-center text-4xl font-bold tracking-wider text-white mb-8">
          <span className="font-serif italic">Coffee</span>
        </div>

        <div className="flex flex-col items-center mb-6">
          <Image
            src="/2.jpg"
            width={96}
            height={96}
            alt="Avatar"
            className="rounded-full mb-3 shadow-lg"
          />
          <span className="text-xl font-semibold">Admin System</span>
        </div>
        <ScrollArea className="flex-grow w-full px-4">
        <nav className="flex flex-col items-start gap-4 w-full px-4">
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <Home className="h-6 w-6 ml-2" />
                <span className="ml-4">Dashboard</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/revenue"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <ChartColumnStacked className="h-6 w-6 ml-2" />
                <span className="ml-4">Revenue</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/menu"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <Coffee className="h-6 w-6 ml-2" />
                <span className="ml-4">Menu</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/size"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <CupSoda className="h-6 w-6 ml-2" />
                <span className="ml-4">Size</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/milk"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <Milk className="h-6 w-6 ml-2" />
                <span className="ml-4">Milk Type</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/taste"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <CakeSlice className="h-6 w-6 ml-2" />
                <span className="ml-4">Taste</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/table"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <RockingChair className="h-6 w-6 ml-2" />
                <span className="ml-4">Table</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/Sum-per-day"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <CalendarDays  className="h-6 w-6 ml-2" />
                <span className="ml-4">Sum-per-day</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/Sum-per-month"
                className="flex h-12 w-full items-center justify-start rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-gray-700"
              >
                <CalendarDays  className="h-6 w-6 ml-2" />
                <span className="ml-4">Sum-per-month</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>
        </nav>
        </ScrollArea>

        <button
          onClick={handleLogout}
          className="mt-auto w-full py-3 text-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </aside>
    </TooltipProvider>
  );
}
