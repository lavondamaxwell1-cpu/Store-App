import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Order Placed!
        </h1>

        <p className="text-gray-600 mb-2">Thank you for your order.</p>

        <p className="text-sm text-gray-500 mb-6 break-all">Order ID: {id}</p>

        <Link
          to="/"
          className="inline-block bg-blue-950 text-white px-6 py-3 rounded-xl hover:bg-blue-900"
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

