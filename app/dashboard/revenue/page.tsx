"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";
import dayjs from "dayjs";


export default function SalesDashboard() {
    const [selectedMonth, setSelectedMonth] = useState("12")
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [data, setData] = useState([])
    const [orders, setOrders] = useState([])

    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
    const years = [2024, 2025];

    const fetchData = async () => {
        try {
            const startDate = dayjs(`${selectedYear}-${selectedMonth}-01`).startOf("month").toISOString();
            const endDate = dayjs(`${selectedYear}-${selectedMonth}-01`).endOf("month").toISOString();

            const res = await axios.get(`${config.apiServer}/api/order/listbydate`, {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
            });

            setData(res.data.results);
            setOrders(res.data.results);
        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const handleMonthChange = (value: string) => setSelectedMonth(value)
    const handleYearChange = (value: string) => setSelectedYear(value)

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <Card className="w-full">
                    <CardContent className="p-6">
                        <div className="flex gap-2 items-center mb-6">
                            <Select onValueChange={handleMonthChange} defaultValue={selectedMonth}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="เลือกเดือน" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month, index) => (
                                        <SelectItem key={index} value={(index + 1).toString().padStart(2, '0')}>{month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handleYearChange} defaultValue={selectedYear}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="เลือกปี" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={fetchData} className="ml-4 bg-blue-600 text-white">
                                อัปเดตข้อมูล
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>รายงานยอดการขาย</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[600px]">
                                    {data.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data} margin={{ top: 20, right: 50, left: 50, bottom: 30 }} barSize={30} barGap={10}>
                                                {/* กำหนด Gradient */}
                                                <defs>
                                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#4A90E2" /> {/* สีเริ่มต้น */}
                                                        <stop offset="100%" stopColor="#50E3C2" /> {/* สีปลาย */}
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    dataKey="date"
                                                    label={{ value: 'วันที่', position: 'insideBottom', offset: -15 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    padding={{ left: 10, right: 10 }}
                                                />
                                                <YAxis
                                                    type="number"
                                                    domain={[0, 'dataMax']}
                                                    label={{ value: 'ยอดขาย (บาท)', angle: -90, position: 'insideLeft', offset: -10 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    padding={{ top: 10, bottom: 10 }}
                                                />
                                                <Bar dataKey="sales" fill="url(#salesGradient)" /> {/* ใช้ gradient */}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            ไม่มีข้อมูลสำหรับช่วงวันที่ที่เลือก
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>รายละเอียดคำสั่งซื้อ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Order ID</TableHead>
                                                <TableHead className="w-[100px]">Table ID</TableHead>
                                                <TableHead className="w-[150px]">Menu Name</TableHead>
                                                <TableHead className="w-[150px]">Date</TableHead> {/* เพิ่มคอลัมน์ Date */}
                                                <TableHead className="w-[250px]">Options</TableHead>
                                                <TableHead className="w-[200px]">Comment</TableHead>
                                                <TableHead className="w-[100px]">Status</TableHead>
                                                <TableHead className="w-[100px]">Quantity</TableHead>
                                                <TableHead className="w-[120px]">Total Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.map((order: any) => (
                                                order.items.map((item: any, index: number) => (
                                                    <TableRow key={`${order.id}-${index}`}>
                                                        {index === 0 && (
                                                            <>
                                                                <TableCell rowSpan={order.items.length}>{order.id}</TableCell>
                                                                <TableCell rowSpan={order.items.length}>{order.table.tableId}</TableCell>
                                                            </>
                                                        )}
                                                        <TableCell>{item.name}</TableCell>

                                                        {/* แสดงวันที่ในรูปแบบวัน/เดือน/ปี */}
                                                        {index === 0 && (
                                                            <TableCell rowSpan={order.items.length}>
                                                                {dayjs(order.createdAt).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        )}

                                                        <TableCell>
                                                            {[item.size ? `Size: ${item.size.name}` : null,
                                                            item.milk ? `Milk: ${item.milk.name}` : null,
                                                            item.taste ? `Taste: ${item.taste.level}` : null,
                                                            item.temperature ? `Temp: ${item.temperature.temperature}` : null,
                                                            item.beanType ? `Bean Type: ${item.beanType}` : null,
                                                            item.roastMethod ? `Roast Method: ${item.roastMethod}` : null
                                                            ]
                                                                .filter(Boolean).join(", ")}
                                                        </TableCell>
                                                        <TableCell>{item.comment}</TableCell>
                                                        {index === 0 && (
                                                            <TableCell rowSpan={order.items.length}>
                                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${order.status === "success" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                                    {order.status}
                                                                </span>
                                                            </TableCell>
                                                        )}
                                                        <TableCell>{item.quantity}</TableCell>
                                                        {index === 0 && <TableCell rowSpan={order.items.length}>฿{order.totalPrice}</TableCell>}
                                                    </TableRow>
                                                ))
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
