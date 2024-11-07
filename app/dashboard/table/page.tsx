'use client';
import { useEffect, useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MyModal from "../component/MyModal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Swal from "sweetalert2";
import config from "@/app/config";
import axios from "axios";

export default function TablePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableId, setTableId] = useState(0);
    const [id, setId] = useState(0);
    const [table, setTable] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiServer + '/api/table/list');
            setTable(res.data.results);
        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const create = async () => {
        if (tableId <= 0) {
            Swal.fire({
                title: "Error",
                text: "หมายเลขโต๊ะไม่ถูกต้อง",
                icon: "error",
            });
            return;
        }

        try {
            const payload = {
                tableId: tableId,
            };

            if (id === 0) {
                await axios.post(config.apiServer + '/api/table/create', payload);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };


    const remove = async (item: any) => {
        try {
            const button = await Swal.fire({
                title: "ต้องการลบข้อมูลใช่หรือไม่",
                text: "คุณต้องการลบข้อมูลใช่หรือไม่",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true
            });
            if (button.isConfirmed) {
                await axios.delete(config.apiServer + '/api/table/remove/' + item.id);
            }
            fetchData();
        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const clear = () => {
        setId(0);
        setTableId(0);
    };

    return (
        <>
            <div className="p-6 space-y-6 w-full max-w-[1400px] mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Table Management</h1>
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                            clear();
                        }}
                        className="w-full sm:w-auto"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        เพิ่มโต๊ะ
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Card className="w-full">
                        <CardHeader>
                            <CardDescription>ตารางการจัดการโต๊ะ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>หมายเลขโต๊ะ</TableHead>
                                        <TableHead className="hidden w-[100px] sm:table-cell">QR Code</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {table.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.tableId}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <img
                                                    alt={`QRCode for table ${item.tableId}`}
                                                    className="aspect-square rounded-md object-cover w-[50px] h-[50px] sm:w-[100px] sm:h-[100px]"
                                                    src={item.qrcode}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => remove(item)}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>


            <MyModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                title="เพิ่มโต๊ะ"
                modalSize="max-w-2xl"
            >
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-left">
                            หมายเลขโต๊ะ
                        </Label>
                        <Input
                            type="number"
                            value={tableId}
                            className="col-span-3"
                            onChange={(e) => setTableId(Number(e.target.value))}
                        />
                    </div>
                </div>
                <Button type="submit" onClick={create}>บันทึก</Button>
            </MyModal>
        </>
    );
}
