'use client';
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface ModalProps {
    isOpen: boolean; 
    setIsOpen: (open: boolean) => void; 
    title: string;
    children: ReactNode;
}

const userModal: React.FC<ModalProps> = ({ isOpen, setIsOpen, title,  children }) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto bg-[url('/bghome.jpg')] ">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <div className="modal-body">{children}</div>
            </DialogContent>
        </Dialog>
    );
};

export default userModal;
