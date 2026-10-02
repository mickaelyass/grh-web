import React from 'react'
import { Link } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login } from '../../../services/apiUser'
import { useNavigate } from 'react-router-dom'

const import { Button } from '../../../ui/Button'
import { Card, CardBody, CardGroup } from '../../../ui/Card'
import { Form, FormInput, InputGroup, InputGroupText } from '../../../ui/Form'
import { Col, Container, Row } from '../../../ui/Grid'
import { Lock, User } from '../../../ui/icons'Login = () => {
  const navigate = useNavigate()
  const [error, setError] = React.useState('')
  
  const validationSchema = Yup.object({
    matricule: Yup.string().required('Le matricule est requis'),
    password: Yup.string().required('Le mot de passe est requis'),
  })

  const formik = useFormik({
    initialValues: {
      matricule: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      try {
        const response = await login(values)
        console.log(response)

        // Enregistrement des informations dans le localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data))

        const role = response.data.role
        console.log("role",role);
        // Rediriger en fonction du rôle de l'utilisateur
        switch (role) {
          case 'admin':
            navigate('/admin/dashboard')
            break
          case 'chef_service':
            navigate('/chef-service/dashboard', { state: { user: response.data } })
            break
          case 'directrice':
            navigate('/directrice/dashboard', { state: { user: response.data } })
            break
          case 'securite':
            navigate('/securite/dashboard', { state: { user: response.data } })
            break
          case 'user':
          default:
            navigate('/user/dashboard', { state: { user: response.data } })
            break
        }
      } catch (error) {
        console.error('Erreur lors de la connexion', error)
        setError(error.response?.data?.error || 'Erreur lors de la connexion')
      } finally {
        setSubmitting(false)
      }

      console.log('Formulaire soumis avec les valeurs:', values)
    },
  })

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <h2>Connexion</h2>
                    <InputGroup className="my-3">
                      <InputGroupText>
                        <Icon icon={User} />
                      </InputGroupText>
                      <FormInput
                        placeholder="matricule"
                        autoComplete="matricule"
                        name="matricule"
                        value={formik.values.matricule}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.matricule && formik.errors.matricule ? true : false}
                      />
                      {formik.touched.matricule && formik.errors.matricule && (
                        <div className="text-danger">{formik.errors.matricule}</div>
                      )}
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <Icon icon={Lock} />
                      </InputGroupText>
                      <FormInput
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="current-password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.password && formik.errors.password ? true : false}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="text-danger">{formik.errors.password}</div>
                      )}
                    </InputGroup>
                    {error && <p className="text-danger mb-3">{error}</p>}
                    <Row>
                      <Col xs={12} className="mb-3 text-left">
                        <Button type="submit" color="primary" className="px-5" disabled={formik.isSubmitting}>
                          Connecter
                        </Button>
                      </Col>
                    </Row>
                    <Row className="justify-content-center">
                      <Col xs={12} className="text-left">
                        <Link to="/forget_password">
                          <Button color="link" className="px-0 me-0">
                            Mot de pass oublié?
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
              <Card className="text-white bg-primary py-5 d-none d-lg-block" style={{ width: '44%' }}>
                <CardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Si vous n'avez pas de compte, veuillez créer un compte ou vous rapprocher du service Ressource Humaine
                    </p>
                    <Link to="/register">
                      <Button color="primary" className="mt-3" active tabIndex={-1}>
                        Créer un compte
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
