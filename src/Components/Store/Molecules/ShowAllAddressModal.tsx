import React from "react";
import "../Helpers/scss/SelectAddress.scss";
import useMystoreStore from "../Core/Store";
import { respStoreAddress } from "../Core/Interfaces";
import { toast } from "react-toastify";
import { FaRegAddressCard } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
interface AddressModalProps {
  opencreateAddressModal: () => void;
  //   setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
const AddressComponentModal: React.FC<AddressModalProps> = ({
  opencreateAddressModal,
}) => {
  const {
    addressSupparator,
    setOpenBarterModal,
    getAddress,
    deleteAddress,
    addressData,
    setSelectedAddress,
    setIsOpenSelectAddressModal,
    addressSupparatorBarter,setOpenBiddingModal
  } = useMystoreStore((s) => s);

  const handleSelectAddress = (address: respStoreAddress) => {
    setSelectedAddress(address);
    setIsOpenSelectAddressModal();
    if (addressSupparator) {
      setOpenBiddingModal();
    }if (addressSupparatorBarter) {
      setOpenBarterModal();
    }
  };

  const handilOpenAddressmodal = () => {
    setIsOpenSelectAddressModal();
    opencreateAddressModal();
  };
  const handleDeleteAddress = async (id: string) => {
    const data = await deleteAddress(id);
    if (data.error) {
      toast.error("can't delete address");
    } else {
      await getAddress();
      toast.error("address deleted successfully");
    }
  };

  const handleBarterSelectAddressModalClose = () => {
    setIsOpenSelectAddressModal();
    if (addressSupparator) {
      setOpenBiddingModal();
    }if (addressSupparatorBarter) {
      setOpenBarterModal();
    }
  };
  return (
    <>
      {/* Modal */}
      <div className="select_address-modal-overlay">
        <div className="select_address-modal-content">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          <div className="select_address-header">1. Delivery Address</div>
          <button
              style={{
                border:"0",
                backgroundColor:"transparent",
                cursor:"pointer"
              }}
              onClick={handleBarterSelectAddressModalClose}
              >
             <IoCloseSharp size={22} title="Close" />
            </button>
              </div>
          <div className="select_address-details">
            {addressData.length === 0 ? (
              <button
                className="select_address-button"
                onClick={handilOpenAddressmodal}
              >
                <FaPlus />
              </button>
            ) : (
              <div>
                {addressData.length > 0 &&
                  addressData?.map((address, index) => (
                    <div key={index} className="select_address-item">
                      <p>
                        <strong>{address.fullName}</strong>
                      </p>
                      <p>
                        {address.fullAddress},{address.pincode}
                      </p>
                      <p>{address.landmark}</p>
                      <p>{address.mobileNumber}</p>
                      <div style={{
                        display:"flex",
                        justifyContent:"space-between"
                      }}>

                      <button
                        className="select_address-button"
                        onClick={() => handleSelectAddress(address)}
                        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}
                        >
                      <FaRegAddressCard  size={22}  />
                      <span>Select</span>
                      </button>
                      <button
                        style={{
                          border:"0px",
                          backgroundColor:"transparent",
                          cursor:"pointer"
                        }}
                        onClick={() => handleDeleteAddress(address.id)}
                        >
                        <MdDelete size={22} title="Delete Address" />
                      </button>
                        </div>
                    </div>
                  ))}
                <div style={{
                   display:"flex",
                      justifyContent:"flex-end",
                      marginRight:"10px"
                }}>
                  <button
                    style={{
                      border:"0px",
                      backgroundColor:"transparent",
                      cursor:"pointer",
                     
                    }}
                    onClick={handilOpenAddressmodal}
                  >
                   <FaPlus size={22} title="Add new Address" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="select_address-footer">
          
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressComponentModal;
