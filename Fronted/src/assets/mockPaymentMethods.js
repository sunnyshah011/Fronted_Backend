import QR from "./QR.png";

const mockPaymentMethods = {
  success: true,
  methods: [
    {
      _id: "1",
      name: "Bank Transfer",
      description: "Send amount to our bank account.",
      details: "Account No: 1234567890, Bank: Nabil Bank",
      image: QR,
    },
    {
      _id: "2",
      name: "eSewa",
      details: "ID: 9801234567",
      image: QR,
    },
    {
      _id: "3",
      name: "FonePay",
      details: "ID: 9841234567",
      image: QR,
    },
  ],
};

export default mockPaymentMethods;
