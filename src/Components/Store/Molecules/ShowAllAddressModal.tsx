import React from "react";
import "../Helpers/scss/SelectAddress.scss";
import useMystoreStore from "../Core/Store";
import { respStoreAddress } from "../Core/Interfaces";
import { toast } from "react-toastify";

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
          <div className="select_address-header">1. Delivery Address</div>
          <div className="select_address-details">
            {addressData.length === 0 ? (
              <button
                className="select_address-button"
                onClick={handilOpenAddressmodal}
              >
                Add new Address
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
                      <button
                        className="select_address-button"
                        onClick={() => handleSelectAddress(address)}
                      >
                        Select Address
                      </button>{" "}
                      <button
                        className="select_address-button"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        Delete Address
                      </button>
                    </div>
                  ))}
                <div>
                  <button
                    className="select_address-button"
                    onClick={handilOpenAddressmodal}
                  >
                    Add new Address
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="select_address-footer">
            <button
              className="select_address-button"
              onClick={handleBarterSelectAddressModalClose}
            >
              Close Modal
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressComponentModal;
