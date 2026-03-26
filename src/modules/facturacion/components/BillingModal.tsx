import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concept: {
    id: string;
    name: string;
    price: number;
  } | null;
  onBill: (data: {
    conceptId: string;
    quantity: number;
    price: number;
    isHouseAccount: boolean;
    payAmount: boolean;
    amount?: number;
    dischargeConsumption: boolean;
  }) => void;
}

export function BillingModal({ open, onOpenChange, concept, onBill }: BillingModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(concept?.price || 0);
  const [isHouseAccount, setIsHouseAccount] = useState(false);
  const [payAmount, setPayAmount] = useState(false);
  const [amount, setAmount] = useState(0);
  const [dischargeConsumption, setDischargeConsumption] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept) return;
    onBill({
      conceptId: concept.id,
      quantity,
      price,
      isHouseAccount,
      payAmount,
      amount: payAmount ? amount : undefined,
      dischargeConsumption,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Facturar {concept?.name}</DialogTitle>
          <DialogDescription>
            Complete los detalles de la facturación.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="houseAccount"
              checked={isHouseAccount}
              onCheckedChange={setIsHouseAccount}
            />
            <Label htmlFor="houseAccount">Es cuenta casa</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="payAmount"
              checked={payAmount}
              onCheckedChange={setPayAmount}
            />
            <Label htmlFor="payAmount">Pagar importe</Label>
          </div>

          {payAmount && (
            <div>
              <Label htmlFor="amount">Importe</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="discharge"
              checked={dischargeConsumption}
              onCheckedChange={setDischargeConsumption}
            />
            <Label htmlFor="discharge">Descargar el consumo</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Facturar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
