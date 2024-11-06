'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
import config from '@/app/config'
import Swal from 'sweetalert2'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"

export default function ReportSumSalePerMonth() {
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [arrYear, setArrYear] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState(dayjs().year().toString());
    const [arrMonth] = useState(['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']);

    useEffect(() => {
        setArrYear(Array.from({ length: 10 }, (_, index) => dayjs().year() - index));
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const payload = {
                year: parseInt(selectedYear)
            }
            const res = await axios.post(config.apiServer + '/api/report/sumPerMonthInYear', payload);
            setData(res.data.results)
            setTotalAmount(sumTotalAmount(res.data.results))
        } catch (e: any) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const sumTotalAmount = (data: any) => {
        let sum = 0;
        data.forEach((item: any) => {
            sum += item.amount
        })
        return sum;
    }

    return (
        <Card className="mt-6 w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center sm:text-left">สรุปยอดขายรายเดือน</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ปี</label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="เลือกปี" />
                            </SelectTrigger>
                            <SelectContent>
                                {arrYear.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end justify-center sm:justify-start lg:justify-end">
                        <Button onClick={fetchData} className="w-full sm:w-auto">
                            <Search className="mr-2 h-4 w-4" /> แสดงรายการ
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">เดือน</TableHead>
                                <TableHead className="text-right">ยอดขาย</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{arrMonth[parseInt(item.month) - 1]}</TableCell>
                                        <TableCell className="text-right">{item.amount.toLocaleString('th-TH')}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                        ไม่มีข้อมูล
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>รวม</TableCell>
                                <TableCell className="text-right font-bold">{totalAmount.toLocaleString('th-TH')}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
