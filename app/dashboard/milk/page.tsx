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


export default function Milk() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [price, setPrice] = useState(0)
  const [id, setId] = useState(0)
  const [milk, setMilk] = useState([])

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/milk/list')
      setMilk(res.data.results)
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }

  const create = async () => {
    try {
      const payload = {
        name: name,
        comment: comment,
        price: price,
        id: id
      }

      if (id == 0) {
        await axios.post(config.apiServer + '/api/milk/create', payload)
      } else {
        await axios.put(config.apiServer + '/api/milk/update', payload)
        setId(0)
      }

      fetchData()
      setIsModalOpen(false)
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }

  const remove = async (item: any) => {
    try {
      const button = await Swal.fire({
        title: "ต้องการลบข้อมูลใช่หรือไม่",
        text: "คุณต้องการลบข้อมูลใช่หรือไม่",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true
      })
      if (button.isConfirmed) {
        await axios.delete(config.apiServer + '/api/milk/remove/' + item.id)
      }
      fetchData()
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }

  const update = (item: any) => {
    setId(item.id)
    setName(item.name)
    setComment(item.comment)
    setPrice(item.price)
    setIsModalOpen(true)
  }

  const clear = () => {
    setId(0)
    setName('')
    setComment('')
    setPrice(0)
  }


  return (
    <>
      <div className="p-6 space-y-6 w-full max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Milk Type</h1>
          <Button
            onClick={() => { setIsModalOpen(true); clear() }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            เพิ่มชนิดนม
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
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milk.map((item: any, index) => (
                    <TableRow key={item.id || index}> {/* ใช้ item.id เป็น key ถ้ามี หรือใช้ index เป็นสำรอง */}
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.comment}</TableCell>
                      <TableCell>{item.price}</TableCell>
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
        title="เพิ่มรสชาติ"
        modalSize="max-w-2xl"
      >
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-left">
              ชนิดนม
            </Label>
            <Input
              value={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left">
              ราคา
            </Label>
            <Input
              type="number"
              className="col-span-3"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left">
              หมายเหตุ
            </Label>
            <Input
              className="col-span-3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" onClick={create}>บันทึก</Button>
      </MyModal>

    </>
  );
}
