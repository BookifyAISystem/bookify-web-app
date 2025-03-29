import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import './PaymentResult.scss';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');

    const timeout = setTimeout(() => {
      if (responseCode === '00') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            navigate('/');
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [searchParams, navigate]);

  return (
    <div className="payment-result">
      <div className="result-card">
        {status === 'loading' && (
          <div className="status loading">
            <Loader2 className="icon" size={96} />
            <p>Đang kiểm tra kết quả thanh toán...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="status success">
            <CheckCircle className="icon" size={120} />
            <p>Thanh toán thành công!</p>
          </div>
        )}
        {status === 'failed' && (
          <div className="status failed">
            <XCircle className="icon" size={120} />
            <p>Thanh toán thất bại.</p>
          </div>
        )}
        {status !== 'loading' && (
          <button className="return-button" onClick={() => navigate('/')}>Về trang chủ ({countdown} giây)</button>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
