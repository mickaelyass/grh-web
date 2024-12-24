import React from 'react'
import { Link } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login } from '../../../services/apiUser'
import { useNavigate } from 'react-router-dom'

const Login = () => {
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
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} md={8} lg={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h2>Connexion</h2>
                    <CInputGroup className="my-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
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
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
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
                    </CInputGroup>
                    {error && <p className="text-danger mb-3">{error}</p>}
                    <CRow>
                      <CCol xs={12} className="mb-3 text-left">
                        <CButton type="submit" color="primary" className="px-5" disabled={formik.isSubmitting}>
                          Connecter
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className="justify-content-center">
                      <CCol xs={12} className="text-left">
                        <Link to="/forget_password">
                          <CButton color="link" className="px-0 me-0">
                            Mot de pass oublié?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-none d-lg-block" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Si vous n'avez pas de compte, veuillez créer un compte ou vous rapprocher du service Ressource Humaine
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Créer un compte
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
