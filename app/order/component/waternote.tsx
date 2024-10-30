import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WaterNote {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaterNote({ isOpen, onClose }: WaterNote) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-0 overflow-hidden">
        <div
          className="relative w-full h-full min-h-[80vh] flex flex-col justify-between p-8"
          style={{
            backgroundImage: "url('/oldnote.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
          `}</style>

          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-6 text-gray-800 z-10">
              <p className="text-lg leading-relaxed font-['Sarabun']">
                ขณะที่คุณกำลังเพลิดเพลินกับการสำรวจชั้นหนังสือในหอสมุดอันกว้างใหญ่ จู่ๆ เหตุการณ์ประหลาดก็เกิดขึ้น มีหนังสือเล่มหนึ่งลอยขึ้นมาจากกองหนังสือมากมายรอบตัว แสงประกายสีดำวูบวาบเปล่งออกมาจากตัวเล่ม พร้อมกับสายน้ำสีดำที่พริ้วไหวราวกับริบบิ้นในอากาศ ลอยวนออกมาจากทุกซอกทุกมุมของห้องสมุด มารวมตัวกันเป็นวงล้อมรอบหนังสือเล่มนั้น
              </p>

              <p className="text-lg leading-relaxed mt-4 font-['Sarabun']">
                เมื่อคุณสูดหายใจเข้าลึกๆ กลิ่นหอมคุ้นเคยก็แทรกเข้ามาในความรู้สึก... กลิ่มของเครื่องดื่มที่คุณหลงใหลมาตลอดชีวิต &quot;กาแฟ&quot; สายน้ำสีดำที่ส่งกลิ่นหอมนั้นค่อยๆ ถูกดูดซึมเข้าสู่ตัวหนังสือจนหายไป ด้วยสัญชาตญาณบางอย่าง คุณยื่นมือออกไปหยิบหนังสือเล่มนั้นขึ้นมา แล้วพบกับชื่อที่ปรากฏบนปก...
              </p>

              <div className="font-['Charm'] text-center mt-8">
                <p className="text-4xl font-bold mb-2">ธาราแห่งความพิศวง</p>
                <p className="text-3xl">เครื่องดื่มแห่งชีวิต</p>
              </div>

              <p className="text-lg leading-relaxed mt-4 font-['Sarabun']">
                ความอยากรู้อยากเห็นเอ่อล้นในใจ มือของคุณสั่นเล็กน้อยขณะที่ค่อยๆ เปิดหน้าแรกของหนังสือ...
              </p>
            </div>
          </ScrollArea>

          <div className="text-center mt-6">
            <span
              onClick={onClose}
              className="cursor-pointer text-amber-100 text-lg font-semibold hover:text-amber-200 transition-colors duration-200"
              style={{
                fontFamily: 'Charm, sans-serif',
              }}
            >
              วางโน้ตลง
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}