'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Trash2 } from "lucide-react";
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Modal from '../dashboard/component/MyModal';
import io from 'socket.io-client';
const socket = io(config.apiServer);


export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [billUrl, setBillUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signup');
    } else {
      fetchData();
    }
  }, [router]);

  useEffect(() => {
    socket.on("new_order", (orderData) => {
      console.log("Received new order data: ", orderData);
      setOrders((prevOrders) => [...prevOrders, orderData]);
      fetchData();
    });

    return () => {
      socket.off("new_order");
    };
  }, []);

  const handleSubmit = async (orderId: number , userId : String) => {
    try {
      const res = await axios.put(
        `${config.apiServer}/api/order/submit/${orderId}`,
        { userId } 
      );
      
      setBillUrl(res.data.fileName);
      setIsModalOpen(true);
      toast.success("Update order success");
      fetchData();
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e.response?.data?.message || "Something went wrong!"
      });
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      await axios.delete(`${config.apiServer}/api/order/remove/${orderId}`);
      toast.success("Delete order success");
      fetchData();
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e.response.data.message
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/order/list');
      setOrders(res.data.results);

      const resRevenue = await axios.get(config.apiServer + '/api/order/getRevenue');
      setTotalRevenue(resRevenue.data.totalRevenue);
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e.response.data.message
      });
    }
  };

  return (
    <div className="min-h-screen p-4 pl-64">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">฿{totalRevenue}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul></ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Order ID</TableHead>
                    <TableHead className="w-[80px]">Custommer Name</TableHead>
                    <TableHead className="w-[150px]">Menu Name</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[300px]">Options</TableHead>
                    <TableHead className="w-[200px]">Comment</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[80px]">Quantity</TableHead>
                    <TableHead className="w-[120px]">Total Price</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders && orders.map((order: any) =>
                    order.items && order.items.map((item: any, index: number) => (
                      <TableRow key={`${order.id}-${index}`}>
                        {index === 0 && (
                          <>
                            <TableCell rowSpan={order.items.length}>{order.id}</TableCell>
                            <TableCell rowSpan={order.items.length}>{order.customerName}</TableCell>
                          </>
                        )}
                        <TableCell>{item.name}</TableCell>
                        {index === 0 && (
                          <TableCell rowSpan={order.items.length}>
                            {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                          </TableCell>
                        )}
                        <TableCell>
                          {[
                            item.size ? `Size: ${item.size.name}` : null,
                            item.milk ? `Milk: ${item.milk.name}` : null,
                            item.taste ? `Taste: ${item.taste.level}` : null,
                            item.temperature ? `Temp: ${item.temperature.temperature}` : null,
                            item.beanType ? `Bean Type: ${item.beanType}` : null,
                            item.roastMethod ? `Roast Method: ${item.roastMethod}` : null,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </TableCell>
                        <TableCell>{item.comment}</TableCell>
                        {index === 0 && (
                          <TableCell rowSpan={order.items.length}>
                            <span
                              className={`text-xs font-medium px-2.5 py-0.5 rounded ${order.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                        )}
                        <TableCell>{item.quantity}</TableCell>
                        {index === 0 && (
                          <TableCell rowSpan={order.items.length}>฿{order.totalPrice}</TableCell>
                        )}
                        {index === 0 && (
                          <TableCell className="text-center" rowSpan={order.items.length}>
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSubmit(order.id , order.userId)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                              >
                                <ArrowUpCircle className="h-5 w-5" />
                                <span className="sr-only">Submit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(order.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                              >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} title="พิมพ์เอกสาร">
          {billUrl && <embed
            src={config.apiServer + '/' + billUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          />}
        </Modal>
      </div>
    </div>
  );
}
