import React, { useState } from "react";
import { Button, Modal as RModal } from "flowbite-react";

type ModalType = {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  children: React.ReactNode;
};

function Modal({ openModal, setOpenModal, children }: ModalType) {
  //   const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
      <RModal
        className="bg-gray-500 bg-opacity-5 flex items-center  justify-center pt-20 z-10   "
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        {/* <RModal.Header
          className="bg-transparent bg-none "
          onClick={() => {
            console.log("has");
          }}
        >
          <button>Click</button>
        </RModal.Header> */}
        {/* <RModal.Header className="border-2">Terms of Service</RModal.Header> */}
        <RModal.Body
          onClick={() => {
            console.log("clicking");
          }}
        >
          {children}
          {/* <div className="bg-white rounded-md">
            <span className="absolute right-2 text-black font-bold">X</span>
            <div className="space-y-6 p-5 ">
              <p className="text-base  leading-relaxed text-gray-500 dark:text-gray-400">
                With less than a month to go before the European Union enacts
                new consumer privacy laws for its citizens, companies around the
                world are updating their terms of service agreements to comply.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                The European Union’s General Data Protection Regulation
                (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                common set of data rights in the European Union. It requires
                organizations to notify users as soon as possible of high-risk
                data breaches that could personally affect them.
              </p>
            </div>
          </div> */}
        </RModal.Body>
        <RModal.Footer>{/*  */}</RModal.Footer>
      </RModal>
    </>
  );
}

export default Modal;
