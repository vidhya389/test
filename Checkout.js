import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_CONFIG } from './constants';
import { v4 as uuidv4 } from 'uuid';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state.cart;
  const [accessToken, setAccessToken] = useState('');
  const [consentId, setConsentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [accountBalances, setAccountBalances] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const [showReferenceNumber, setShowReferenceNumber] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [creditScore, setCreditScore] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [accountId, setAccountId] = useState('');

  const handleViewBalanceClick = () => {
    setLoading(true);
    setTimeout(() => {
      setShowBalance(true);
      setLoading(false);
    }, 2000); // 2-second delay
  };

  const handlePayClick = () => {
    setLoading2(true);
    setTimeout(() => {
      setShowReferenceNumber(true);
      setLoading2(false);
    }, 2000); // 2-second delay
  };

  return (
    <div className="checkout-container">
      <h1 className="heading">Checkout</h1>
      <p className="total-cost">Total Cost: ${location.state.totalCost}</p>

      <button className="view-balance-btn" onClick={handleViewBalanceClick}>
        View Account Balance
      </button>
      {loading ? (
        <div className="loading-container">
          <p>Loading...</p>
          <div className="loader"></div>
        </div>
      ) : (
        showBalance && (
          <div className="balance-container">
            {(
              <div>
                <p>
                  Account ID: 54XXXX4578
                </p>
                <p>
                  11297.81 GBP
                </p>
              </div>
            )}
          </div>
        )
      )}
      <p> {" "}</p>
      <button className="pay-btn" onClick={handlePayClick}>
        Pay
      </button>
      {loading2 ? (
        <div className="loading-container">
          <p>Loading...</p>
          <div className="loader"></div>
        </div>
      ) : (
        showReferenceNumber && (
          <div className="reference-number-container">
            <p>Reference Number: 68479512398120</p>
          </div>
        )
      )}
    </div>
  );
};

export default Checkout;