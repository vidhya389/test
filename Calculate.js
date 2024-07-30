import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_CONFIG } from './constants';
import { v4 as uuidv4 } from 'uuid';

function Calculate() {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [consentId, setConsentId] = useState('');
  const location = useLocation();
  const totalCost = location.state.totalCost;
  const [amount, setAmount] = useState(totalCost);
  const [currency, setCurrency] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const handleNewCheckout = () => {
    navigate('/newCalculate', { state: { totalCost } });
  };

  const handleCalculate = () => {
    setLoading(true); // Set loading to true when API request starts
    const { CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT } = API_CONFIG;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=payments`;

    fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers,
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.access_token);
        makeSecondApiCall(data.access_token);
      })
      .catch(error => console.error(error));
  };

  const makeSecondApiCall = (accessToken) => {
    const idempotencyKey = uuidv4();
    console.log('totalCost: '+totalCost);
    const url = 'https://cors-anywhere.herokuapp.com/https://ob.sandbox.natwest.com/open-banking/v3.1/pisp/bnpl-payment-consents';
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-idempotency-key': idempotencyKey,
      'x-jws-signature': 'DUMMY_SIG',
    };
    const data = {
      "Data": {
        "Initiation": {
          "InstructionIdentification": "instr-identification",
          "EndToEndIdentification": "e2e-identification",
          "InstructedAmount": {
            "Amount": totalCost ? totalCost.toString() : "0.00",
            "Currency": "GBP"
          },
          "CreditorAccount": {
            "SchemeName": "SortCodeAccountNumber",
            "Identification": "50499910000998",
            "Name": "ACME DIY",
            "SecondaryIdentification": "secondary-identif"
          },
          "RemittanceInformation": {
            "Unstructured": "Tools",
            "Reference": "Tools"
          }
        }
      },
      "Risk": {
        "PaymentContextCode": "EcommerceGoods",
        "MerchantCategoryCode": null,
        "MerchantCustomerIdentification": null,
        "DeliveryAddress": null
      }
    };

    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        const consentId = data.Data.ConsentId;
        makeThirdApiCall(consentId);
      })
      .catch(error => console.error(error));
  };
    const makeThirdApiCall = (consentId) => {
      console.log(consentId);
      const url = `${API_CONFIG.PROXY_URL}${API_CONFIG.AUTHORIZATION_ENDPOINT}?client_id=${API_CONFIG.CLIENT_ID}&response_type=code id_token&scope=openid payments&redirect_uri=${encodeURIComponent(API_CONFIG.REDIRECT_URI)}&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_result=APPROVED&authorization_username=${API_CONFIG.PSU_USERNAME}&authorization_account=${API_CONFIG.PSU_DEBTOR_ACCOUNT_IDENTIFICATION}&state=ABC&authorization_bnpl_selected=true`;
      fetch(url, {
        method: 'GET',
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(data => {
           if (typeof data === 'string') {
             // Handle HTML response
             console.log('HTML response:', data);
           } else {
             const redirectUri = data.redirectUri;
             console.log('redirectUri: ', redirectUri);
             const fragment = redirectUri.split("#")[1];
             const params = fragment.split("&");

             const code = params[0].split("=")[1];

             console.log('code:', code);
             // Use the idToken as needed
              makeFourthApiCall(code, consentId);
           }
         })
         .catch(error => console.error(error));
       };

    const makeFourthApiCall = (authorizationCode, consentId) => {
      const url = 'https://ob.sandbox.natwest.com/token';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const data = `client_id=${API_CONFIG.CLIENT_ID}&client_secret=${API_CONFIG.CLIENT_SECRET}&redirect_uri=${API_CONFIG.REDIRECT_URI}&grant_type=authorization_code&code=${authorizationCode}`;

      fetch(url, {
        method: 'POST',
        headers,
        body: data,
      })
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access_token;
        console.log('Access Token:', accessToken);
        makeFifthApiCall(accessToken, consentId);
      })
      .catch(error => console.error(error));
    };

const makeFifthApiCall = (accessToken, consentId) => {
  console.log('totalCost: '+totalCost);
  const url = 'https://cors-anywhere.herokuapp.com/https://ob.sandbox.natwest.com/open-banking/v3.1/pisp/bnpl-payments';
  const idempotencyKey = uuidv4();
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'x-idempotency-key': idempotencyKey,
    'x-jws-signature': 'DUMMY_SIG',
  };
  const data = {
    "Data": {
      "ConsentId": consentId,
      "Initiation": {
        "InstructionIdentification": "instr-identification",
        "EndToEndIdentification": "e2e-identification",
        "InstructedAmount": {
          "Amount": totalCost ? totalCost.toString() : "0.00",
          "Currency": "GBP"
        },
        "CreditorAccount": {
          "SchemeName": "SortCodeAccountNumber",
          "Identification": "50499910000998",
          "Name": "ACME DIY",
          "SecondaryIdentification": "secondary-identif"
        },
        "RemittanceInformation": {
          "Unstructured": "Tools",
          "Reference": "Tools"
        }
      }
    },
    "Risk": {
      "PaymentContextCode": "EcommerceGoods"
    }
  };

  fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
      const amount = data.Data.Initiation.InstructedAmount.Amount;
      const currency = data.Data.Initiation.InstructedAmount.Currency;
      const reference = data.Data.Initiation.RemittanceInformation.Reference;

      document.getElementById('amount').innerText = `Amount: ${amount}`;
      document.getElementById('currency').innerText = `Currency: ${currency}`;
      document.getElementById('reference').innerText = `Reference: ${reference}`;
      console.log('Fifth API call response:', data);
  })
  .catch(error => console.error(error))
   .finally(() => {
            setLoading(false);
  });
};
  return (
      <div>
      <button onClick={handleCalculate}>Calculate</button>
            {loading ? (
                    <div>
                      <p>Loading...</p>
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <p> </p>
                  )}
            <p id="amount"></p>
            <p id="currency"></p>
            <p id="reference"></p>
            <button onClick={handleNewCheckout}>Proceed to NewCalculate</button>
          </div>
  );
}

export default Calculate;