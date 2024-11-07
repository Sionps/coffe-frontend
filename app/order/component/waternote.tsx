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
          className="relative w-full h-full min-h-[60vh] flex flex-col justify-between p-6" 
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

          <ScrollArea className="flex-grow pr-3"> {/* Reduced padding on the right */}
            <div className="space-y-4 text-gray-800 z-10"> {/* Reduced spacing between paragraphs */}
              <p className="text-base leading-relaxed font-['Sarabun']"> {/* Reduced font size */}
                ขณะที่คุณกำลังเพลิดเพลินกับการสำรวจชั้นหนังสือในหอสมุดอันกว้างใหญ่ จู่ๆ เหตุการณ์ประหลาดก็เกิดขึ้น มีหนังสือเล่มหนึ่งลอยขึ้นมาจากกองหนังสือมากมายรอบตัว แสงประกายสีดำวูบวาบเปล่งออกมาจากตัวเล่ม พร้อมกับสายน้ำสีดำที่พริ้วไหวราวกับริบบิ้นในอากาศ ลอยวนออกมาจากทุกซอกทุกมุมของห้องสมุด มารวมตัวกันเป็นวงล้อมรอบหนังสือเล่มนั้น
              </p>

              <p className="text-base leading-relaxed mt-3 font-['Sarabun']"> {/* Reduced font size */}
                เมื่อคุณสูดหายใจเข้าลึกๆ กลิ่นหอมคุ้นเคยก็แทรกเข้ามาในความรู้สึก... กลิ่มของเครื่องดื่มที่คุณหลงใหลมาตลอดชีวิต &quot;กาแฟ&quot; สายน้ำสีดำที่ส่งกลิ่นหอมนั้นค่อยๆ ถูกดูดซึมเข้าสู่ตัวหนังสือจนหายไป ด้วยสัญชาตญาณบางอย่าง คุณยื่นมือออกไปหยิบหนังสือเล่มนั้นขึ้นมา แล้วพบกับชื่อที่ปรากฏบนปก...
              </p>

              <div className="font-['Charm'] text-center mt-6"> {/* Adjusted margin for alignment */}
                <p className="text-3xl font-bold mb-1">ธาราแห่งความพิศวง</p> {/* Reduced font size */}
                <p className="text-2xl">เครื่องดื่มแห่งชีวิต</p> {/* Reduced font size */}
              </div>

              <p className="text-base leading-relaxed mt-3 font-['Sarabun']"> {/* Reduced font size */}
                ความอยากรู้อยากเห็นเอ่อล้นในใจ มือของคุณสั่นเล็กน้อยขณะที่ค่อยๆ เปิดหน้าแรกของหนังสือ...
              </p>
            </div>
          </ScrollArea>

          <div className="text-center mt-4"> {/* Adjusted margin */}
            <span
              onClick={onClose}
              className="cursor-pointer text-amber-100 text-base font-semibold hover:text-amber-200 transition-colors duration-200"
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