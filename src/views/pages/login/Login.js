import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../../../services/apiUser'
import { normalizeRole } from '../../../config/roles'

import Button from '../../../ui/Button'
import { Card, CardBody, CardGroup } from '../../../ui/Card'
import { Form, FormInput, InputGroup, InputGroupText } from '../../../ui/Form'
import { Col, Container, Row } from '../../../ui/Grid'
import Icon from '../../../ui/Icon'
import { Lock, User as UserIcon } from '../../../ui/icons'

const schema = z.object({
  matricule: z.string().min(1, 'Le matricule est requis'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = React.useState('')

  // Session expirée détectée par RequireRole au refresh : on prévient l'utilisateur.
  const sessionExpired = location.state?.sessionExpired

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { matricule: '', password: '' },
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      const response = await login(values)

      // Enregistrement des informations dans le localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))

      // `employe` (API) et `user` (front) désignent le même espace agent.
      const role = normalizeRole(response.data.role)
      // Rediriger en fonction du rôle de l'utilisateur
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard'); break
        case 'chef_service':
          navigate('/chef-service/dashboard', { state: { user: response.data } }); break
        case 'directrice':
          navigate('/directrice/dashboard', { state: { user: response.data } }); break
        case 'securite':
          navigate('/securite/dashboard', { state: { user: response.data } }); break
        case 'user':
        default:
          navigate('/user/dashboard', { state: { user: response.data } }); break
      }
    } catch (err) {
      console.error('Erreur lors de la connexion', err)
      setError(err.response?.data?.error || 'Erreur lors de la connexion')
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h2>Connexion</h2>
                    {sessionExpired && (
                      <div className="alert alert-warning" role="alert">
                        Votre session a expiré. Veuillez vous reconnecter.
                      </div>
                    )}
                    <InputGroup className="my-3">
                      <InputGroupText>
                        <Icon icon={UserIcon} />
                      </InputGroupText>
                      <Controller
                        control={control}
                        name="matricule"
                        render={({ field }) => (
                          <FormInput
                            placeholder="matricule"
                            autoComplete="matricule"
                            invalid={Boolean(errors.matricule)}
                            {...field}
                          />
                        )}
                      />
                      {errors.matricule && (
                        <div className="text-danger">{errors.matricule.message}</div>
                      )}
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <Icon icon={Lock} />
                      </InputGroupText>
                      <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                          <FormInput
                            type="password"
                            placeholder="Mot de passe"
                            autoComplete="current-password"
                            invalid={Boolean(errors.password)}
                            {...field}
                          />
                        )}
                      />
                      {errors.password && (
                        <div className="text-danger">{errors.password.message}</div>
                      )}
                    </InputGroup>
                    {error && <p className="text-danger mb-3">{error}</p>}
                    <Row>
                      <Col xs={12} className="mb-3 text-left">
                        <Button type="submit" color="primary" className="px-5" disabled={isSubmitting}>
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
                      Si vous n&apos;avez pas de compte, veuillez créer un compte ou vous rapprocher du service Ressource Humaine
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
