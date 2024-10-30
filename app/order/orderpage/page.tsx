'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from 'next/navigation';
import config from "../../config";
import MyModal from "../component/MyModal";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Coffee, ShoppingCart, Trash2, Settings2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import WelcomeDialog from "../component/welcomenote";
import WaterNote from "../component/waternote";
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';

export default function OrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get('tableId');
  const token = searchParams.get('token');
  const [isValid, setIsValid] = useState(false);
  const [menu, setMenu] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    variant: '',
    size: '',
    sugar: '',
    milkType: '',
    beanType: '',
    roastMethod: ''
  });
  const [cartItems, setCartItems] = useState([])
  const total = cartItems.reduce((sum, item: any) => sum + item.price * item.quantity, 0)
  const [activeTab, setActiveTab] = useState("home");
  const [id, setId] = useState(0);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [milkType, setMilkType] = useState([])
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [tastes, setTastes] = useState([])
  const [temperatures, setTemperatures] = useState([])
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [showWaterDialog, setShowWaterDialog] = useState(false);

  const createMysteryItem = async () => {
    try {
      const payload = {
        tableId: tableId,
        sizeId: selectedOptions.size || null,
        milkId: selectedOptions.milkType || null,
        tasteId: selectedOptions.sugar || null,
        temperatureId: selectedOptions.variant || null,
        comment: additionalNotes,
        beanType: selectedOptions.beanType || null,
        roastMethod: selectedOptions.roastMethod || null
      }
      await axios.post(config.apiServer + "/api/orderitem/createMystery", payload);
      toast.success("Mystery item added to cart!");
      fetchData();
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
        await axios.delete(config.apiServer + "/api/orderitem/remove/" + item.id);
      }
      fetchData();
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }
  const createOrderItem = async () => {
    try {
      const payload = {
        name: selectedMenu.name,
        menuId: selectedMenu.id,
        price: calculateTotalPrice(),
        sizeId: selectedOptions.size || null,
        milkId: selectedOptions.milkType || null,
        tasteId: selectedOptions.sugar || null,
        temperatureId: selectedOptions.variant || null,
        beanType: selectedOptions.beanType || null,
        roastMethod: selectedOptions.roastMethod || null,
        quantity: quantity,
        tableId: tableId,
        orderId: null,
        comment: additionalNotes
      };
      if (id == 0) {
        await axios.post(config.apiServer + '/api/orderitem/create', payload);
        toast.success("Place order success");
      } else {
        await axios.put(config.apiServer + '/api/orderitem/update', { ...payload, id });
        toast.success("Update order success");
        setId(0);
      }

      setIsModalOpen(false);
      setIsEditModelOpen(false);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const createOrder = async () => {
    try {
      const payload = {
        tableId: tableId,
        totalPrice: total
      }

      await axios.post(config.apiServer + '/api/order/create', payload);
      toast.success("Place order success");
      fetchData();
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      })
    }
  }

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + `/api/menu/list`);
      setMenu(res.data.results);

      const resOrderItem = await axios.get(config.apiServer + `/api/orderitem/list`, { params: { tableId, } });
      setCartItems(resOrderItem.data.results);

      const resTaste = await axios.get(config.apiServer + '/api/taste/list');
      setTastes(resTaste.data.results);

      const resMilkType = await axios.get(config.apiServer + '/api/milk/list');
      setMilkType(resMilkType.data.results);

      const resTemperature = await axios.get(config.apiServer + '/api/temperature/list');
      setTemperatures(resTemperature.data.results);
      console.log(resTemperature.data.results);

    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (tableId && token) {
      verifyToken();
    }
    fetchData();
  }, [tableId, token]);

  const verifyToken = async () => {
    try {
      const res = await axios.get(config.apiServer + `/api/table/verify`, { params: { tableId, token } });
      if (res.data.valid) {
        setIsValid(true);
      } else {
        Swal.fire({
          title: "Access Denied",
          text: "Token is invalid or expired",
          icon: "error",
        }).then(() => {
          router.push("/");
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleOptionChange = (optionType: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionType]: value }));
  };

  const calculateTotalPrice = () => {
    if (!selectedMenu) return 0;
    let total = selectedMenu.price;

    if (selectedOptions.size && selectedMenu.sizes) {
      const selectedSize = selectedMenu.sizes.find((size: any) => size.id === selectedOptions.size);
      if (selectedSize) total += selectedSize.price;
    }

    if (selectedOptions.milkType && selectedMenu.milkTypes) {
      const selectedMilk = selectedMenu.milkTypes.find((milk: any) => milk.id === selectedOptions.milkType);
      if (selectedMilk) total += selectedMilk.price;
    }

    return total * quantity;
  };

  const update = (item: any) => {
    setId(item.id);
    setSelectedMenu(item.menu);
    setQuantity(item.quantity);
    setAdditionalNotes(item.comment);
    setSelectedOptions({
      variant: item.temperatureId || '',
      size: item.sizeId || '',
      milkType: item.milkId || '',
      sugar: item.tasteId || '',
      beanType: item.beanType || '',
      roastMethod: item.roastMethod || ''
    });
    setIsEditModelOpen(true);
  };


  if (!isValid) {
    return <div>กำลังตรวจสอบ...</div>;
  }

  const handleClearAll = () => {
    setSelectedOptions(
      {
        variant: '',
        size: '',
        milkType: '',
        sugar: '',
        beanType: '',
        roastMethod: ''
      }
    )
    setAdditionalNotes('')
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <ToastContainer />

      {activeTab === "home" && (
        <div className="w-full min-h-screen pb-16 flex flex-col font-['Poppins',sans-serif] bg-[url('/bghome.jpg')] bg-center bg-cover">
          <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap');
      `}</style>
          <WelcomeDialog isOpen={showWelcomeDialog} onClose={() => setShowWelcomeDialog(false)} />
          <CardHeader className="relative py-6 ">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-gray-400/60" />
              <h1 className="text-2xl font-bold text-black font-['Charm']">
                สั่งกาแฟสำหรับโต๊ะ {tableId}
              </h1>
              <div className="w-16 h-px bg-gray-400/60" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto p-4 font-['Charm']" >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {menu.map((item: any) => (
                <Card key={item.id} className="flex flex-col overflow-hidden bg-white shadow-md border-none"
                  onClick={() => {
                    setSelectedMenu(item);
                    setIsModalOpen(true);
                    setQuantity(1);
                    setSelectedOptions({ variant: '', size: '', sugar: '', milkType: '', beanType: '', roastMethod: '' });
                  }}>
                  <img src={config.apiServer + '/uploads/' + item.img} alt={item.name} className="w-full aspect-square object-cover" />
                  <CardContent className="flex-grow p-3 bg-white font-['Charm']">
                    <h3 className="font-semibold text-sm text-[#4a3728]">{item.name}</h3>
                    <p className="text-xs text-[#7d6354]">{item.comment}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-sm text-[#4a3728]">{item.price}฿</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </div>
      )}

      {activeTab === "coffee" && (
        <div className="min-h-screen bg-[url('/bgpaper.jpg')] bg-cover bg-center p-6 font-[Charm] text-gray-800">
          <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap');
    `}</style>
          <div className="max-w-sm mx-auto space-y-4">
            <h1 className="text-3xl font-bold text-center mb-6">ธาราแห่งความสับสน</h1>
            <p className="text-lg text-center mb-4">ธาราแห่งความสับสนคือเครื่องดื่มที่จะแปลพันตามความรู้สึกของผู้กิน</p>
            <WaterNote isOpen={showWaterDialog} onClose={() => setShowWaterDialog(false)} />

            <div>
              <h2 className="text-xl font-semibold mb-2">ถ่ายทอดจิตใจ</h2>
              <Textarea
                placeholder="บอกความรู้สึกของคุณวันนี้ ให้บาริสต้าช่วยรังสรรค์กาแฟที่เข้ากับอารมณ์ของคุณ..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full h-24 bg-transparent border-gray-800 bg-white"
              />
            </div>

            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold whitespace-nowrap">มนตราแห่งเมล็ดกาแฟ</h2>
              <RadioGroup value={selectedOptions.beanType} onValueChange={(value) => handleOptionChange("beanType", value)} className="flex space-x-4">
                <Label htmlFor="arabica" className={`cursor-pointer transition-colors ${selectedOptions.beanType === 'arabica' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
                  <RadioGroupItem value="arabica" id="arabica" className="sr-only" /> อาราบิก้า
                </Label>
                <Label htmlFor="robusta" className={`cursor-pointer transition-colors ${selectedOptions.beanType === 'robusta' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
                  <RadioGroupItem value="robusta" id="robusta" className="sr-only" /> โรบัสต้า
                </Label>
                <Label htmlFor="blend" className={`cursor-pointer transition-colors ${selectedOptions.beanType === 'blend' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
                  <RadioGroupItem value="blend" id="blend" className="sr-only" /> เบลนด์
                </Label>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold whitespace-nowrap">พิธีกรรมการคั่ว</h2>
              <RadioGroup value={selectedOptions.roastMethod} onValueChange={(value) => handleOptionChange("roastMethod", value)} className="flex space-x-4">
                <Label htmlFor="light" className={`cursor-pointer transition-colors ${selectedOptions.roastMethod === 'light' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
                  <RadioGroupItem value="light" id="light" className="sr-only" /> คั่วอ่อน
                </Label>
                <Label htmlFor="medium" className={`cursor-pointer transition-colors ${selectedOptions.roastMethod === 'medium' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
                  <RadioGroupItem value="medium" id="medium" className="sr-only" /> คั่วกลาง
                </Label>
                <Label htmlFor="dark" className={`cursor-pointer transition-colors ${selectedOptions.roastMethod === 'dark' ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}>
                  <RadioGroupItem value="dark" id="dark" className="sr-only" /> คั่วเข้ม
                </Label>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold whitespace-nowrap">น้ำทิพย์แห่งท้องทุ่ง</h2>
              <RadioGroup value={selectedOptions.milkType} onValueChange={(value) => handleOptionChange("milkType", value)} className="flex space-x-4 flex-wrap">
                {milkType.map((milk: any) => (
                  <Label
                    key={milk.id}
                    htmlFor={milk.name}
                    className={`cursor-pointer transition-colors ${selectedOptions.milkType === milk.id ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}
                  >
                    <RadioGroupItem value={milk.id} id={milk.name} className="sr-only" />
                    {milk.name}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold whitespace-nowrap">มนตร์เสกความหวาน</h2>
              <RadioGroup value={selectedOptions.sugar} onValueChange={(value) => handleOptionChange("sugar", value)} className="flex space-x-4">
                {tastes.map((taste: any) => (
                  <Label
                    key={taste.id}
                    htmlFor={taste.level}
                    className={`cursor-pointer transition-colors ${selectedOptions.sugar === taste.id ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}
                  >
                    <RadioGroupItem value={taste.id} id={taste.level} className="sr-only" />
                    {taste.level}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold whitespace-nowrap">อาคมแห่งอุณหภูมิ</h2>
              <RadioGroup value={selectedOptions.variant} onValueChange={(value) => handleOptionChange("variant", value)} className="flex space-x-4 flex-wrap">
                {temperatures.map((temperature: any) => (
                  <Label
                    key={temperature.id}
                    htmlFor={temperature.temperature}
                    className={`cursor-pointer transition-colors ${selectedOptions.variant === temperature.id ? 'text-yellow-600 font-bold' : 'text-gray-600'}`}
                  >
                    <RadioGroupItem value={temperature.id} id={temperature.temperature} className="sr-only" />
                    {temperature.temperature}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" onClick={createMysteryItem}>
                ปรุงเครื่องดื่มแห่งตำนาน
              </Button>
              <Button type="button" onClick={handleClearAll} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white">
                ล้างคาถาทั้งหมด
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cart" && (
        <div className="min-h-screen bg-[#f5e6d3] font-['Poppins',sans-serif] p-4 bg-[url('/bghome.jpg')] ">
          <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap');
    `}</style>
          <Card className="mb-6  bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-[Charm] text-[#4a3728] ">หีบแห่งโอสถดำ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-[Charm]">
              {cartItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-start space-x-4 ">
                    <img src={config.apiServer + '/uploads/' + (item.menu?.img || 'unknow.webp')} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h2 className="font-semibold text-[#4a3728]">{item.name}</h2>
                      <p className="text-sm text-[#7d6354]">
                        {[
                          item.size ? `ขนาด: ${item.size.name}` : null,
                          item.milk ? `น้ำนม: ${item.milk.name}` : null,
                          item.taste ? `ความหวาน: ${item.taste.level}` : null,
                          item.temperature ? `อุณหภูมิ: ${item.temperature.temperature}` : null,
                          item.beanType ? `สายพันธุ์: ${item.beanType}` : null,
                          item.roastMethod ? `การคั่ว: ${item.roastMethod}` : null
                        ].filter(Boolean).join(", ")}
                      </p>
                      <p className="text-sm text-[#7d6354]">{item.comment}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-[#4a3728]">จำนวนโอสถ: {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-[#4a3728]">ทองคำ: ฿{item.price * item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => remove(item)}
                        variant="ghost"
                        size="icon"
                        className="text-[#7d6354] hover:text-[#4a3728] hover:bg-transparent"
                      >
                        <Trash2 size={20} />
                      </Button>
                      {item.name !== "ธาราแห่งความพิศวง" &&
                        <Button
                          onClick={() => update(item)}
                          variant="ghost"
                          size="icon"
                          className="text-[#7d6354] hover:text-[#4a3728] hover:bg-transparent"
                        >
                          <Settings2 size={20} />
                        </Button>
                      }
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
            <Separator className="my-4" />
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-[Cheam] text-[#4a3728]">ยอดรวมแห่งทองคำ</span>
              <span className="text-lg font-[Charm] text-[#4a3728]">฿{total}</span>
            </CardFooter>
          </Card>

          <Card className="border-none">
            <CardContent className="p-4 font-[Charm]">
              <Button
                className="w-full bg-[#4a3728] text-white py-2 rounded-full hover:bg-[#7d6354]"
                onClick={() => createOrder()}
              >
                ก้าวสู่พิธีชำระแห่งทองคำ
              </Button>
            </CardContent>
          </Card>
        </div>
      )}



      <MyModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title=""
      >
        {selectedMenu && (
          <div className="space-y-4  p-4 rounded-lg ">
            {/* Section 1: Product Info and Quantity */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src={config.apiServer + '/uploads/' + selectedMenu.img} alt={selectedMenu.name} className="w-full aspect-square object-cover rounded-lg mb-4" />

              <div className="text-center mb-4 font-['Charm']" >
                <h3 className="text-xl font-semibold text-[#4a3728]">{selectedMenu.name}</h3>
                <p className="text-sm text-[#7d6354]">{selectedMenu.comment}</p>
                <p className="font-bold text-lg text-[#4a3728]">฿{selectedMenu.price}</p>
              </div>

              <div className="flex justify-center items-center space-x-4 ">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-2 bg-[#d4b59d] text-[#4a3728] rounded-md hover:bg-[#c3a089]">
                  <Minus size={20} />
                </button>
                <span className="text-xl font-semibold text-[#4a3728]">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} className="p-2 bg-[#d4b59d] text-[#4a3728] rounded-md hover:bg-[#c3a089]">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Section 2: Customization Options */}
            <div className="bg-white p-4 rounded-lg shadow-md font-['Charm']">
              {/* Variants (Hot/Ice) */}
              {selectedMenu.temperatures && selectedMenu.temperatures.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-[#4a3728]">Variants</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedMenu.temperatures.map((temperature: any) => (
                      <label key={temperature.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.variant === temperature.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="variant"
                          value={temperature.id}
                          checked={selectedOptions.variant === temperature.id}
                          onChange={() => handleOptionChange('variant', temperature.id)}
                          className="sr-only"
                        />
                        <span>{temperature.temperature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {selectedMenu.sizes && selectedMenu.sizes.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-[#4a3728]">Size</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedMenu.sizes.map((size: any) => (
                      <label key={size.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.size === size.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="size"
                          value={size.id}
                          checked={selectedOptions.size === size.id}
                          onChange={() => handleOptionChange('size', size.id)}
                          className="sr-only"
                        />
                        <span>{size.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugar */}
              {selectedMenu.tastes && selectedMenu.tastes.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-[#4a3728]">Sugar</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedMenu.tastes.map((taste: any) => (
                      <label key={taste.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.sugar === taste.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="sugar"
                          value={taste.id}
                          checked={selectedOptions.sugar === taste.id}
                          onChange={() => handleOptionChange('sugar', taste.id)}
                          className="sr-only"
                        />
                        <span>{taste.level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Types */}
              {selectedMenu.milkTypes && selectedMenu.milkTypes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-[#4a3728]">Milk Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedMenu.milkTypes.map((milk: any) => (
                      <label key={milk.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.milkType === milk.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="milkType"
                          value={milk.id}
                          checked={selectedOptions.milkType === milk.id}
                          onChange={() => handleOptionChange('milkType', milk.id)}
                          className="sr-only"
                        />
                        <span>{milk.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Been Types */}
              <div>
                <Label className="text-sm font-medium text-[#4a3728]">Bean Type</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['อาราบิก้า', 'โรบัสต้า', 'เบลนด์'].map((bean: any) => (
                    <label key={bean} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.beanType === bean ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                      <input
                        type="radio"
                        name="milkType"
                        value={bean}
                        checked={selectedOptions.beanType === bean}
                        onChange={() => handleOptionChange('beanType', bean)}
                        className="sr-only"
                      />
                      <span>{bean}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Roast Method*/}
              <div>
                <Label className="text-sm font-medium text-[#4a3728]"> Roast Method</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['คั่วอ่อน', 'คั่วกลาง', 'คั่วเข้ม'].map((roast: any) => (
                    <label key={roast} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.roastMethod === roast ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                      <input
                        type="radio"
                        name="milkType"
                        value={roast}
                        checked={selectedOptions.roastMethod === roast}
                        onChange={() => handleOptionChange('roastMethod', roast)}
                        className="sr-only"
                      />
                      <span>{roast}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mt-4 bg-white p-4 rounded-lg shadow-md font-['Charm']">
              <Label className="text-sm font-medium text-[#4a3728]">Comment</Label>
              <Textarea
                placeholder="Add any additional notes here..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full h-24 bg-white border border-[#d4b59d] rounded-md p-2 mt-2"
              />
            </div>

            <Separator className="my-4" />

            {/* Section 3: Total and Add Order */}
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between font-['Charm']">
              <div className="text-lg font-semibold text-[#4a3728]">
                Total: ฿{calculateTotalPrice()}
              </div>
              <Button type="submit" className="bg-[#4a3728] text-white px-6 py-2 text-sm font-semibold rounded-full hover:bg-[#7d6354]"
                onClick={() => createOrderItem()}>
                Add Order
              </Button>
            </div>
          </div>
        )}
      </MyModal>

      <MyModal
        isOpen={isEditModelOpen}
        setIsOpen={setIsEditModelOpen}
        title="แก้ไข"
      >
        {selectedMenu && (
          <div className="space-y-4  p-4 rounded-lg">
            {/* Section 1: Product Info and Quantity */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src={config.apiServer + '/uploads/' + selectedMenu.img} alt={selectedMenu.name} className="w-full aspect-square object-cover rounded-lg mb-4" />

              <div className="text-center mb-4 font-['Charm']">
                <h3 className="text-xl font-semibold text-[#4a3728]">{selectedMenu.name}</h3>
                <p className="text-sm text-[#7d6354]">{selectedMenu.comment}</p>
                <p className="font-bold text-lg text-[#4a3728]">฿{selectedMenu.price}</p>
              </div>

              <div className="flex justify-center items-center space-x-4">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-2 bg-[#d4b59d] text-[#4a3728] rounded-md hover:bg-[#c3a089]">
                  <Minus size={20} />
                </button>
                <span className="text-xl font-semibold text-[#4a3728]">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} className="p-2 bg-[#d4b59d] text-[#4a3728] rounded-md hover:bg-[#c3a089]">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Section 2: Customization Options */}
            <div className="bg-white p-4 rounded-lg shadow-md font-['Charm']">
              {/* Variants (Hot/Ice) */}
              {selectedMenu.temperatures && selectedMenu.temperatures.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-[#4a3728]">Variants</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedMenu.temperatures.map((temperature: any) => (
                      <label key={temperature.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.variant === temperature.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="variant"
                          value={temperature.id}
                          checked={selectedOptions.variant === temperature.id}
                          onChange={() => handleOptionChange('variant', temperature.id)}
                          className="sr-only"
                        />
                        <span>{temperature.temperature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {selectedMenu.sizes && selectedMenu.sizes.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-[#4a3728]">Size</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedMenu.sizes.map((size: any) => (
                      <label key={size.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.size === size.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="size"
                          value={size.id}
                          checked={selectedOptions.size === size.id}
                          onChange={() => handleOptionChange('size', size.id)}
                          className="sr-only"
                        />
                        <span>{size.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugar */}
              {selectedMenu.tastes && selectedMenu.tastes.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-[#4a3728]">Sugar</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedMenu.tastes.map((taste: any) => (
                      <label key={taste.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.sugar === taste.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="sugar"
                          value={taste.id}
                          checked={selectedOptions.sugar === taste.id}
                          onChange={() => handleOptionChange('sugar', taste.id)}
                          className="sr-only"
                        />
                        <span>{taste.level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Types */}
              {selectedMenu.milkTypes && selectedMenu.milkTypes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-[#4a3728]">Milk Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedMenu.milkTypes.map((milk: any) => (
                      <label key={milk.id} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.milkType === milk.id ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                        <input
                          type="radio"
                          name="milkType"
                          value={milk.id}
                          checked={selectedOptions.milkType === milk.id}
                          onChange={() => handleOptionChange('milkType', milk.id)}
                          className="sr-only"
                        />
                        <span>{milk.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Been Types */}
              <div>
                <Label className="text-sm font-medium text-[#4a3728]">Bean Type</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['อาราบิก้า', 'โรบัสต้า', 'เบลนด์'].map((bean: any) => (
                    <label key={bean} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.beanType === bean ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                      <input
                        type="radio"
                        name="milkType"
                        value={bean}
                        checked={selectedOptions.beanType === bean}
                        onChange={() => handleOptionChange('beanType', bean)}
                        className="sr-only"
                      />
                      <span>{bean}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Roast Method */}
              <div>
                <Label className="text-sm font-medium text-[#4a3728]"> Roast Method</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['คั่วอ่อน', 'คั่วกลาง', 'คั่วเข้ม'].map((roast: any) => (
                    <label key={roast} className={`flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer ${selectedOptions.roastMethod === roast ? 'bg-[#d4b59d] text-[#4a3728]' : 'bg-white text-[#7d6354]'}`}>
                      <input
                        type="radio"
                        name="milkType"
                        value={roast}
                        checked={selectedOptions.roastMethod === roast}
                        onChange={() => handleOptionChange('roastMethod', roast)}
                        className="sr-only"
                      />
                      <span>{roast}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>



            <Separator className="my-4" />

            <div className="mt-4 bg-white p-4 rounded-lg shadow-md font-['Charm']">
              <Label className="text-sm font-medium text-[#4a3728]">Comment</Label>
              <Textarea
                placeholder="Add any additional notes here..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full h-24 bg-white border border-[#d4b59d] rounded-md p-2 mt-2"
              />
            </div>

            <Separator className="my-4" />

            {/* Section 3: Total and Add Order */}
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between font-['Charm']">
              <div className="text-lg font-semibold text-[#4a3728]">
                Total: ฿{calculateTotalPrice()}
              </div>
              <Button type="submit" className="bg-[#4a3728] text-white px-6 py-2 text-sm font-semibold rounded-full hover:bg-[#7d6354]"
                onClick={() => createOrderItem()}>
                Add Order
              </Button>
            </div>
          </div>
        )}
      </MyModal>


      <Tabs defaultValue="home" onValueChange={(value) => {
        setActiveTab(value);
        if (value === "coffee") {
          setShowWaterDialog(true);
        }
      }} className="bg-card border-t border-border mt-auto fixed bottom-0 w-full bg-white">
        <TabsList className="flex justify-around py-2 w-full">
          <TabsTrigger value="home" className="flex-1">
            <Button variant="ghost" className="flex justify-center">
              <Home className="h-6 w-6" />
            </Button>
          </TabsTrigger>
          <TabsTrigger value="coffee" className="flex-1" >
            <Button variant="ghost" className="flex justify-center">
              <Coffee className="h-6 w-6" />
            </Button>
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex-1">
            <Button variant="ghost" className="flex justify-center">
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Suspense >
    </>

  );
}
