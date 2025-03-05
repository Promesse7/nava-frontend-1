import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/Card";
import { FaWallet, FaCreditCard, FaHistory, FaUndo } from "react-icons/fa";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";


const PaymentTransactions = ({ userId }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setWalletBalance(data.walletBalance || 0);
        }

        const transactionsSnapshot = await getDocs(collection(db, "users", userId, "transactions"));
        setTransactions(transactionsSnapshot.docs.map(doc => doc.data()));

        const paymentMethodsSnapshot = await getDocs(collection(db, "users", userId, "paymentMethods"));
        setPaymentMethods(paymentMethodsSnapshot.docs.map(doc => doc.data()));

        const refundRequestsSnapshot = await getDocs(collection(db, "users", userId, "refundRequests"));
        setRefundRequests(refundRequestsSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-indigo-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Payment & Transactions
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-green-50 border-l-4 border-green-500">
            <FaWallet className="text-green-500 text-4xl" />
            <CardContent>
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
              <p className="text-gray-600">${walletBalance.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment History */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-blue-50 border-l-4 border-blue-500">
            <FaHistory className="text-blue-500 text-4xl" />
            <CardContent>
              <h2 className="text-xl font-semibold">Payment History</h2>
              <p className="text-gray-600">{transactions.length} Transactions</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saved Payment Methods */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-yellow-50 border-l-4 border-yellow-500">
            <FaCreditCard className="text-yellow-500 text-4xl" />
            <CardContent>
              <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
              <p className="text-gray-600">{paymentMethods.length} Cards Saved</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refund Requests */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-red-50 border-l-4 border-red-500">
            <FaUndo className="text-red-500 text-4xl" />
            <CardContent>
              <h2 className="text-xl font-semibold">Refund Requests</h2>
              <p className="text-gray-600">{refundRequests.length} Pending</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentTransactions;
