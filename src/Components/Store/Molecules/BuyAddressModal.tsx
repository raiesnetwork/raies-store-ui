import React, { useState, ChangeEvent, FormEvent } from "react";
import "../Helpers/scss/BuyAddress.scss";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import useMystoreStore from "../Core/Store";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";

interface AddressData {
  fullName: string;
  mobileNumber: string;
  fullAddress: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  email: string;
}

interface AddressErrors {
  country?: string;
  state?: string;
  city?: string;
  fullName?: string;
  mobileNumber?: string;
  fullAddress?: string;
  landmark?: string;
  pincode?: string;
  email?: string;
}

interface AddressModalProps {
  closeModal: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ closeModal }) => {
  const { createAddress, getAddress } = useMystoreStore((s) => s);
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    landmark: "",
    pincode: "",
    city: "",
    country: "IN",
    state: "",
    email: "",
  });
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const countries = Country.getAllCountries();
  const states = addressData.country
    ? State.getStatesOfCountry(addressData.country)
    : [];
  const citys = addressData.state
    ? City.getCitiesOfState(addressData.country, addressData.state)
    : [];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setAddressErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  
  const setMobileNumber = (n: string) => {
    setAddressData((prevData) => ({
      ...prevData,
      mobileNumber: n,
    }));
  };
  
  const validateAddress = (): boolean => {
    const newErrors: AddressErrors = {};
    if (!addressData.fullName.trim())
      newErrors.fullName = "Full name is required.";
    if (
      !addressData.mobileNumber.trim() ||
      !/^\+\d{7,}$/.test(addressData.mobileNumber)
    ) {
      newErrors.mobileNumber = "Valid mobile number is required.";
    }
    if (!addressData.fullAddress.trim())
      newErrors.fullAddress = "Full address is required.";
    if (
      !addressData.email.trim() ||
      !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(addressData.email.trim())
    ) {
      newErrors.email = "Valid email is required.";
    }
    if (!addressData.pincode.trim() || !/^\d{6}$/.test(addressData.pincode))
      newErrors.pincode = "Valid 6-digit pincode is required.";
    if (!addressData.country) newErrors.country = "Country is required.";
    if (!addressData.state) newErrors.state = "State is required.";
    if (!addressData.city) newErrors.city = "City is required.";

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAddress()) {
      const data = await createAddress(addressData);

      if (data.error) {
        toast.error("We couldn't create your address. Please try again.");
      } else {
        if (data.data === "exceed") {
          return toast.success(
            "You cannot add more than 5 delivery addresses."
          );
        }
        toast.success("Your address has been created successfully!");
        await getAddress();
        closeModal();
      }
    }
  };

  return (
    <Modal show={true} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Delivery Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddressSubmit}>
          <FloatingLabel controlId="fullName" label="Full Name" className="mb-3">
            <Form.Control
              type="text"
              name="fullName"
              value={addressData.fullName}
              onChange={handleChange}
              isInvalid={!!addressErrors.fullName}
              placeholder="Full Name"
            />
            <Form.Control.Feedback type="invalid">
              {addressErrors.fullName}
            </Form.Control.Feedback>
          </FloatingLabel>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <div className="phone-input-container">
              <PhoneInput
                onChange={(phone) => {
                  setMobileNumber(phone);
                }}
                name="mobileNumber"
                defaultCountry="in"
                disableDialCodeAndPrefix={true}
                value={addressData.mobileNumber}
                inputStyle={{
                  backgroundColor: "transparent",
                  border: "1px solid #ced4da",
                  width: "100%",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.25rem",
                }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    backgroundColor: "transparent",
                    border: "0",
                  },
                }}
              />
            </div>
            {addressErrors.mobileNumber && (
              <Form.Text className="text-danger">
                {addressErrors.mobileNumber}
              </Form.Text>
            )}
          </Form.Group>

          <FloatingLabel controlId="email" label="Email" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              value={addressData.email}
              onChange={handleChange}
              isInvalid={!!addressErrors.email}
              placeholder="Email"
            />
            <Form.Control.Feedback type="invalid">
              {addressErrors.email}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="fullAddress" label="Full Address" className="mb-3">
            <Form.Control
              as="textarea"
              name="fullAddress"
              value={addressData.fullAddress}
              onChange={handleChange}
              isInvalid={!!addressErrors.fullAddress}
              placeholder="Full Address"
              style={{ height: '100px' }}
            />
            <Form.Control.Feedback type="invalid">
              {addressErrors.fullAddress}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="landmark" label="Landmark (Optional)" className="mb-3">
            <Form.Control
              type="text"
              name="landmark"
              value={addressData.landmark}
              onChange={handleChange}
              placeholder="Landmark (Optional)"
            />
          </FloatingLabel>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <FloatingLabel controlId="country" label="Country">
                <Form.Select
                  name="country"
                  value={addressData.country}
                  onChange={handleChange}
                  isInvalid={!!addressErrors.country}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {addressErrors.country}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div className="col-md-4">
              <FloatingLabel controlId="state" label="State">
                <Form.Select
                  name="state"
                  value={addressData.state}
                  onChange={handleChange}
                  isInvalid={!!addressErrors.state}
                  disabled={!addressData.country}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {addressErrors.state}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div className="col-md-4">
              <FloatingLabel controlId="city" label="City">
                <Form.Select
                  name="city"
                  value={addressData.city}
                  onChange={handleChange}
                  isInvalid={!!addressErrors.city}
                  disabled={!addressData.state}
                >
                  <option value="">Select City</option>
                  {citys.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {addressErrors.city}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
          </div>

          <FloatingLabel controlId="pincode" label="Pincode" className="mb-3">
            <Form.Control
              type="number"
              name="pincode"
              value={addressData.pincode}
              onChange={handleChange}
              isInvalid={!!addressErrors.pincode}
              placeholder="Pincode"
              maxLength={6}
            />
            <Form.Control.Feedback type="invalid">
              {addressErrors.pincode}
            </Form.Control.Feedback>
          </FloatingLabel>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={closeModal} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Address
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddressModal;