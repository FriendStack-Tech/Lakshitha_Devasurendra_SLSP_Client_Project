import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <div style={{textAlign:'center', padding:'80px'}}>
      <h2>Payment Cancelled</h2>
      <p>You cancelled the payment. Your order is saved — you can pay later.</p>
      <button onClick={() => navigate('/orders')}>View Orders</button>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
};

export default PaymentCancel;