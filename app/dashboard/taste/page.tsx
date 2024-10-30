'use client';
import { useEffect, useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MyModal from "../component/MyModal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Swal from "sweetalert2";
import  config  from "@/app/config";
import axios from "axios";


export default function Taste() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [level, setLevel] = useState("");
  const [comment, setComment] = useState("");
  const [taste , setTaste] = useState([])
  const [id , setId] = useState(0)  

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/taste/list')
      setTaste(res.data.results)
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
        level: level,
        comment: comment,
        id: id
      }

      if (id === 0 ){
        await axios.post(config.apiServer + '/api/taste/create', payload)
      }else {
        await axios.put(config.apiServer + '/api/taste/update', payload)
        setId(0)
      }
      fetchData()
      setIsModalOpen(false)
    } catch (e : any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }

  const remove = async (item : any) => {
    try {
      const button = await Swal.fire({
        title: "ต้องการลบข้อมูลใช่หรือไม่",
        text: "คุณต้องการลบข้อมูลใช่หรือไม่",
        icon : "question",
        showCancelButton : true,
        showConfirmButton : true
      })

      if(button.isConfirmed){
        await axios.delete(config.apiServer + '/api/taste/remove/' + item.id)
      }
      fetchData()
    } catch (e : any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }

  const edit = async (item : any) => {
    setId(item.id)
    setLevel(item.level)
    setComment(item.comment)
    setIsModalOpen(true)
  }

  const clear = () => {
    setId(0)
    setLevel("")
    setComment("")
  }


  return (
    <>
      <div className="p-6 space-y-6 w-full max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Taste</h1>
          <Button
            onClick={() => {setIsModalOpen(true); clear()}} 
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            เพิ่มรสชาติ
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
                    <TableHead>Name</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taste.map((items : any , index) => (
                    <TableRow key={items.id || index}>
                      <TableCell className="font-medium">{items.level}</TableCell>
                      <TableCell>{items.comment}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {edit(items)}}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => remove(items)}>Delete</DropdownMenuItem>
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
              รสชาติ
            </Label>
            <Input
              className="col-span-3"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label  className="text-left">
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
