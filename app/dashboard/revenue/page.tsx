'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Chart as ChartJS } from 'chart.js/auto';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Dashboard() {
    const [incomePerDays, setIncomePerDays] = useState<any[]>([]);
    const [incomePerMonths, setIncomePerMonths] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [monthName, setMonthName] = useState<string[]>([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]);
    const [days, setDays] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
    const [month, setMonth] = useState<number>(dayjs().month() + 1);
    const [chartPerDay, setChartPerDay] = useState<ChartJS | null>(null);
    const [chartPerMonth, setChartPerMonth] = useState<ChartJS | null>(null);

    useEffect(() => {
        const totalDayInMonth = dayjs().daysInMonth();

        setDays(Array.from({ length: totalDayInMonth }, (_, index) => index + 1));
        setYears(Array.from({ length: 5 }, (_, index) => dayjs().year() - index));

        fetchData();
    }, []);

    const fetchData = () => {
        fetchDataSumPerDayInYearAndMonth();
        fetchDataSumPerMonthInYear();
    }

    const createBarChartDays = (incomePerDays: any[]) => {
        let labels: number[] = [];
        let datas: number[] = [];

        for (let i = 0; i < incomePerDays.length; i++) {
            const item = incomePerDays[i];
            labels.push(i + 1);
            datas.push(item.amount);
        }

        const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement;

        if (chartPerDay) {
            chartPerDay.destroy();
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'รายรับรวมตามวัน (บาท)',
                    data: datas,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

        setChartPerDay(chart);
    }

    const fetchDataSumPerDayInYearAndMonth = async () => {
        try {
            const payload = {
                year: selectedYear,
                month: month
            }

            const res = await axios.post(`${config.apiServer}/api/report/sumPerDayInYearAndMonth`, payload);
            setIncomePerDays(res.data.results);
            createBarChartDays(res.data.results);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: e.message
            });
        }
    }

    const createBarChartMonths = (incomePerMonths: any[]) => {
        let datas: number[] = [];

        for (let i = 0; i < incomePerMonths.length; i++) {
            datas.push(incomePerMonths[i].amount);
        }

        const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement;

        if (chartPerMonth) {
            chartPerMonth.destroy();
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: monthName,
                datasets: [{
                    label: 'รายรับรวมตามเดือน (บาท)',
                    data: datas,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

        setChartPerMonth(chart);
    }

    const fetchDataSumPerMonthInYear = async () => {
        try {
            const payload = {
                year: selectedYear
            }

            const res = await axios.post(`${config.apiServer}/api/report/sumPerMonthInYear`, payload);
            setIncomePerMonths(res.data.results);
            createBarChartMonths(res.data.results);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: e.message
            });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white rounded shadow-lg p-6 mt-6 w-full max-w-5xl">
                <div className="text-2xl font-medium mb-4">Dashboard</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col mb-4">
                        <label className="text-sm font-medium mb-1">ปี</label>
                        <select 
                            className="border border-gray-300 rounded p-2 text-base"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {years.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-sm font-medium mb-1">เดือน</label>
                        <select 
                            className="border border-gray-300 rounded p-2 text-base"
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                        >
                            {monthName.map((item, index) => (
                                <option key={index} value={index + 1}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end mb-4">
                        <button
                            className="bg-blue-500 text-white font-medium py-2 px-4 rounded text-base hover:bg-blue-600"
                            onClick={fetchData}
                        >
                            <i className="fa fa-search mr-2" />
                            แสดงข้อมูล
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-6">
                    <div>
                        <div className="text-lg font-semibold mb-2">สรุปยอดขายรายวัน</div>
                        <canvas id="chartPerDay" height="220" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold mb-2">สรุปยอดขายรายเดือน</div>
                        <canvas id="chartPerMonth" height="220" />
                    </div>
                </div>
            </div>
        </div>
    );
}
