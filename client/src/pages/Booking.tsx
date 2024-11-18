import RequestForm from '@/components/RequestForm'
import React from 'react'
import { useLocation } from 'react-router-dom';

function Booking() {

  const { state } = useLocation();
  console.log("state: ", state)
  const { celebuid, fanuid, price } = state;
  return (
    <RequestForm
    // setOrderModal={setOrderModal}
    celebuid={celebuid}
    fanuid={fanuid}
    price={price}
    
  />
   
  )
}

export default Booking  