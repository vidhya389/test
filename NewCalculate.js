import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function NewCalculate() {
  const navigate = useNavigate();
  const location = useLocation();
  const totalCost = location.state.totalCost;
  console.log('totalCost: '+totalCost);
  const [frequency, setFrequency] = useState('monthly');
  const [installmentCost, setInstallmentCost] = useState(0);

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
    calculateInstallmentCost(event.target.value);
  };

const calculateInstallmentCost = (frequency) => {
  let installmentCost;
  if (typeof totalCost === 'number' && !isNaN(totalCost)) {
    switch (frequency) {
      case 'monthly':
        installmentCost = totalCost / 12;
        break;
      case 'quarterly':
        installmentCost = totalCost / 4;
        break;
      case 'biannually':
        installmentCost = totalCost / 2;
        break;
      case 'annually':
        installmentCost = totalCost;
        break;
      default:
        installmentCost = 0;
    }
  } else {
    installmentCost = 0;
  }
  setInstallmentCost(installmentCost);
};

  return (
    <div>
      <h2>Installment Calculator</h2>
      <select value={frequency} onChange={handleFrequencyChange}>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="biannually">Biannually</option>
        <option value="annually">Annually</option>
      </select>
      <p>Installment Cost: {installmentCost.toFixed(2)}</p>
    </div>
  );
}

export default NewCalculate;