import React from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto p-0 overflow-hidden">
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
            <div className="space-y-6 text-gray-800 z-10 font-['Sarabun']">

              <p className="text-lg leading-relaxed italic">
                เมื่อคุณเดินเข้ามาในหอสมุดแห่งความรู้ คุณได้พบกับชั้นหนังสือยาวที่ดูเก่าแก่และมีร่องรอยแห่งกาลเวลา พร้อมกับกระดาษโน้ตเก่าๆ ที่วางอยู่บนโต๊ะไม้โบราณ ด้วยความอยากรู้อยากเห็น คุณจึงหยิบกระดาษแผ่นนั้นขึ้นมาอ่าน
              </p>

              <div className="font-['Charm'] text-center text-2xl mt-4">
                <p>&quot;ยินดีต้อนรับสู่หอสมุดแห่งธารา&quot;</p>
              </div>
              <div className="font-['Charm'] text-center text-xl mt-2">
                <p>&quot;สถานที่ซึ่งรวบรวมความรู้ของเครื่องดื่มมหัศจรรย์จากทั่วทุกมุมโลก&quot;</p>
              </div>

              <div className="font-['Charm'] text-lg leading-relaxed mt-4 space-y-4">
                <p>
                &quot;ที่นี่คือขุมทรัพย์แห่งความรู้เกี่ยวกับกาแฟ ตั้งแต่ประวัติศาสตร์อันยาวนานของเมล็ดกาแฟ วิธีการปลูกและเก็บเกี่ยว ไปจนถึงศิลปะการคั่วและชงที่ละเอียดอ่อน คุณจะได้พบกับตำราโบราณที่บอกเล่าเรื่องราวของกาแฟจากยุคแรกเริ่ม และบันทึกการเดินทางของเมล็ดกาแฟจากถิ่นกำเนิดสู่ทั่วทุกมุมโลก&quot;
                </p>
                <p>
                &quot;นอกจากนี้ ยังมีหนังสือที่รวบรวมสูตรลับและเทคนิคการชงกาแฟจากบาริสต้าชื่อดังทั่วโลก ตลอดจนแผนที่โบราณที่บ่งบอกถึงเส้นทางการค้ากาแฟในอดีต และภาพวาดละเอียดของเครื่องชงกาแฟโบราณหายากที่เคยใช้ในยุคต่างๆ&quot;
                </p>
              </div>

              <p className="text-lg leading-relaxed mt-4 italic">
                เมื่อคุณอ่านจบ คุณรู้สึกตื่นเต้นกับความรู้มากมายที่รออยู่เบื้องหน้า และอดใจรอไม่ไหวที่จะเริ่มต้นการผจญภัยในโลกแห่งกาแฟที่น่าหลงใหล คุณวางกระดาษลงอย่างเบามือ และเริ่มสำรวจชั้นหนังสือที่เต็มไปด้วยความรู้รอบตัว
              </p>
            </div>
          </ScrollArea>

          {/* ลิงก์ปิด */}
          <div className="text-center mt-6">
            <span 
              onClick={onClose} 
              className="cursor-pointer text-amber-100 text-lg font-semibold hover:text-amber-200 transition-colors duration-200"
              style={{
                fontFamily: 'Charm, sans-serif',
              }}
            >
              คลิกที่นี่เพื่อเริ่มการผจญภัยของคุณ
            </span>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
