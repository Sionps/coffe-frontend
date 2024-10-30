'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MyModal from "../component/MyModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import config from "@/app/config";
import axios from "axios";

// Interfaces สำหรับข้อมูลแต่ละประเภท
interface MenuItem {
    id: number;
    name: string;
    comment: string;
    price: number;
    img: string;
    sizes: Size[];
    milkTypes: MilkType[];
    tastes: Taste[];
    temperatures: Temperature[];
}

interface Size {
    id: number;
    name: string;
}

interface MilkType {
    id: number;
    name: string;
}

interface Taste {
    id: number;
    level: string;
}

interface Temperature {
    id: number;
    temperature: string;
}

export default function SizeComponent() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [img, setImg] = useState<string>('');
    const [myFile, setMyFile] = useState<File | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [milkTypes, setMilktypes] = useState<MilkType[]>([]);
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [temperatures, setTemperatures] = useState<Temperature[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    const [selectSizes, setSelectSizes] = useState<number[]>([]);
    const [selectMilkTypes, setSelectMilkTypes] = useState<number[]>([]);
    const [selectTastes, setSelectTastes] = useState<number[]>([]);
    const [selectTemperatures, setSelectTemperatures] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const selectImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setMyFile(e.target.files[0]);
        }
    };

    const upload = async (): Promise<string | undefined> => {
        try {
            const formData = new FormData();
            if (myFile) {
                formData.append('myFile', myFile);
            }

            const res = await axios.post(config.apiServer + '/api/menu/upload', formData);
            return res.data.fileName;
        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiServer + '/api/menu/list');
            setMenu(res.data.results);

            const resSizes = await axios.get(config.apiServer + '/api/size/list');
            setSizes(resSizes.data.results);

            const resMilkTypes = await axios.get(config.apiServer + '/api/milk/list');
            setMilktypes(resMilkTypes.data.results);

            const resTaste = await axios.get(config.apiServer + '/api/taste/list');
            setTastes(resTaste.data.results);

            const resTemperatures = await axios.get(config.apiServer + '/api/temperature/list');
            setTemperatures(resTemperatures.data.results);
        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const create = async () => {
        try {
            const imgurl = await upload();
            const payload = {
                name: name,
                comment: comment,
                price: price,
                id: id,
                img: imgurl,
                sizes: selectSizes,
                milkTypes: selectMilkTypes,
                tastes: selectTastes,
                temperatures: selectTemperatures
            };

            if (id === 0) {
                await axios.post(config.apiServer + '/api/menu/create', payload);
            } else {
                await axios.put(config.apiServer + '/api/menu/update', payload);
                setId(0);
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

    const remove = async (item: MenuItem) => {
        try {
            const button = await Swal.fire({
                title: "ต้องการลบข้อมูลใช่หรือไม่",
                text: "คุณต้องการลบข้อมูลใช่หรือไม่",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true
            });
            if (button.isConfirmed) {
                await axios.delete(config.apiServer + '/api/menu/remove/' + item.id);
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

    const update = (item: MenuItem) => {
        setId(item.id);
        setName(item.name);
        setComment(item.comment);
        setPrice(item.price);
        setImg(item.img);
        setSelectMilkTypes(item.milkTypes.map((milk) => milk.id));
        setSelectSizes(item.sizes.map((size) => size.id));
        setSelectTastes(item.tastes.map((taste) => taste.id));
        setSelectTemperatures(item.temperatures.map((temp) => temp.id));
        setIsModalOpen(true);
    };
    const clear = () => {
        setId(0);
        setName('');
        setPrice(0);
        setImg('');
        setComment('');
        setMyFile(null);
        setSelectSizes([]);
        setSelectMilkTypes([]);
        setSelectTastes([]);
        setSelectTemperatures([]);
    };

    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setSelected: React.Dispatch<React.SetStateAction<number[]>>,
        selectedItem: number[]
    ) => {
        const { value, checked } = e.target;
        const parsedValue = parseInt(value, 10);
        if (checked) {
            setSelected([...selectedItem, parsedValue]);
        } else {
            setSelected(selectedItem.filter((item) => item !== parsedValue));
        }
    };

    return (
        <>
            <div className="p-6 space-y-6 w-full max-w-[1400px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Menu</h1>
                    <Button
                        onClick={() => { setIsModalOpen(true); clear() }}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        เพิ่มเมนู
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Card className="w-full">
                        <CardHeader>
                            <CardDescription>
                                รสชาติมากมายรอให้ค้นพบ
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[100px] sm:table-cell">
                                        </TableHead>
                                        <TableHead>ชื่อ</TableHead>
                                        <TableHead>หมายเหตุ</TableHead>
                                        <TableHead>ราคา</TableHead>
                                        <TableHead>ชนิดนม</TableHead>
                                        <TableHead>รสชาติ</TableHead>
                                        <TableHead>ขนาด</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menu.map((item: any) => (
                                        <TableRow>
                                            <TableCell className="hidden sm:table-cell" id={item.id}>
                                                <img
                                                    alt={item.name}
                                                    className="aspect-square rounded-md object-cover"
                                                    height="100px"
                                                    src={config.apiServer + '/uploads/' + item.img}
                                                    width="100px"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.comment}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.milkTypes.map((milk: any) => milk.name).join(", ")}</TableCell>
                                            <TableCell>{item.tastes.map((taste: any) => taste.level).join(", ")}</TableCell>
                                            <TableCell>{item.sizes.map((size: any) => size.name).join(", ")}</TableCell>
                                            <TableCell>{item.temperatures.map((temperature: any) => temperature.temperature).join(", ")}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => update(item)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => remove(item)}>Delete</DropdownMenuItem>
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
                title="แก้ไขเมนู"
                modalSize="max-w-2xl"
            >
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-left">เมนู</Label>
                        <Input
                            value={name}
                            className="col-span-3"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">ราคา</Label>
                        <Input
                            type="number"
                            className="col-span-3"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">หมายเหตุ</Label>
                        <Input
                            className="col-span-3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">รูป</Label>
                        {img && (
                            <img
                                className="mb-2 img-fluid"
                                src={`${config.apiServer}/uploads/${img}`}
                                alt={name}
                                width="100"
                            />
                        )}
                        <input
                            type="file"
                            id="myFile"
                            className="form-control"
                            onChange={(e) => selectImg(e)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">ขนาด</Label>
                        <div className="flex flex-wrap gap-4">
                            {sizes.map((size: any) => (
                                <div key={size.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={size.id}
                                        checked={selectSizes.includes(size.id)}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        onChange={(e) => handleCheckboxChange(e, setSelectSizes, selectSizes)}
                                    />
                                    <span className="text-gray-700">{size.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">ชนิดนม</Label>
                        <div className="flex flex-wrap gap-4">
                            {milkTypes.map((milk: any) => (
                                <div key={milk.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={milk.id}
                                        checked={selectMilkTypes.includes(milk.id)}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        onChange={(e) => handleCheckboxChange(e, setSelectMilkTypes, selectMilkTypes)}
                                    />
                                    <span className="text-gray-700">{milk.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">ความหวาน</Label>
                        <div className="flex flex-wrap gap-4">
                            {tastes.map((taste) => (
                                <div key={taste.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={taste.id}
                                        checked={selectTastes.includes(taste.id)} // ตั้งค่าให้ checkbox ถูกเลือกตามที่บันทึกไว้
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        onChange={(e) => handleCheckboxChange(e, setSelectTastes, selectTastes)}
                                    />
                                    <span className="text-gray-700">{taste.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">สถานะ</Label>
                        <div className="flex flex-wrap gap-4">
                            {temperatures.map((temperature) => (
                                <div key={temperature.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={temperature.id}
                                        checked={selectTemperatures.includes(temperature.id)} // ตั้งค่าให้ checkbox ถูกเลือกตามที่บันทึกไว้
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        onChange={(e) => handleCheckboxChange(e, setSelectTemperatures, selectTemperatures)}
                                    />
                                    <span className="text-gray-700">{temperature.temperature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Button type="submit" onClick={create}>บันทึก</Button>
            </MyModal>

        </>
    );
}
