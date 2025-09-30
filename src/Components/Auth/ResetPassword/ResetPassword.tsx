import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './ResetPassword.scss';
import Header from '../../Store/Molecules/Header';
import useMystoreStore from '../../Store/Core/Store';
import { getSubdomain } from '../../../Utils/Subdomain';
import { ArrowLeft } from '@mui/icons-material';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { updateNewPassword, verifyResetToken } from '../../Store/Core/StoreApi';

const { hostname } = window.location;
const subdomain = getSubdomain(hostname);

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { storeData } = useMystoreStore((state) => state);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setTokenValid(false);
      setValidating(false);
      return;
    }

    try {
      const response = await verifyResetToken(token, subdomain);
      setTokenValid(!response.error);
    } catch (error) {
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // Validation
    if (formData.password.length < 6) {
      setAlert({ type: 'danger', message: 'Password must be at least 6 characters long' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'danger', message: 'Passwords do not match' });
      return;
    }

    if (!token) {
      setAlert({ type: 'danger', message: 'Invalid reset token' });
      return;
    }

    setLoading(true);

    try {
      const response = await updateNewPassword(token, formData.password, subdomain);
      
      if (response.error) {
        setAlert({ type: 'danger', message: response.message || 'Failed to reset password' });
      } else {
        setAlert({ 
          type: 'success', 
          message: 'Password reset successfully! Redirecting to login...' 
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (validating) {
    return (
      <>
        <Header />
        <div className="reset-password-page">
          <Container>
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <Card className="reset-card">
                  <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 mb-0">Validating reset token...</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }

  if (!tokenValid) {
    return (
      <>
        <Header />
        <div className="reset-password-page">
          <Container>
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <Card className="reset-card">
                  <Card.Body className="text-center">
                    <div className="reset-header mb-4">
                      <h2>Invalid Reset Link</h2>
                      <p className="text-muted">This password reset link is invalid or has expired.</p>
                    </div>
                    <Alert variant="warning">
                      <strong>Please request a new reset link.</strong>
                    </Alert>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        // @ts-ignore
                        as={Link} 
                        to="/login"
                        className="back-to-login-btn"
                      >
                        <ArrowLeft className="me-2" />
                        Back to Login
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="reset-password-page">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="reset-card">
                <Card.Body>
                  <div className="reset-header text-center mb-4">
                    <h2>Reset Your Password</h2>
                    <p className="text-muted">
                      Create a new password for your {storeData?.storeName || 'store'} account
                    </p>
                  </div>

                  {alert && (
                    <Alert 
                      variant={alert.type} 
                      className="mb-4"
                      dismissible
                      onClose={() => setAlert(null)}
                    >
                      {alert.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <div className="password-input-group">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          required
                          className="password-input"
                        />
                        <Button
                          variant="outline-secondary"
                          type="button"
                          className="password-toggle-btn"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <BsEyeSlash /> : <BsEye />}
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm New Password</Form.Label>
                      <div className="password-input-group">
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                          required
                          className="password-input"
                        />
                        <Button
                          variant="outline-secondary"
                          type="button"
                          className="password-toggle-btn"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                        </Button>
                      </div>
                    </Form.Group>

                    <div className="d-grid mb-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="reset-btn"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Resetting Password...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <Link to="/login" className="back-to-login-link">
                        <ArrowLeft className="me-1" />
                        Back to Login
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ResetPassword;