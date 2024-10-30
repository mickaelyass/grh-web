import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AdminForm = ({ user, onSubmit }) => {
  const initialValues = {
    matricule:user ? user.matricule: '',
    role: user ? user.role:'',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    matricule: Yup.string().required('Matricule is required'),
   // role: Yup.string().required('Role is required'),
    role: Yup.string().oneOf(['chef_service', 'directrice','admin']).required('Role is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={user || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form>
        <div className="form-group">
          <label htmlFor="matricule">Matricule</label>
          <Field name="matricule" type="text" className="form-control" />
          <ErrorMessage name="matricule" component="div" className="text-danger" />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <Field as="select" name="role" className="form-control">
            <option value="">Select Role</option>
            <option value="chef_service">Chef Service</option>
            <option value="directrice">Directrice</option>
            <option value="admin">Admin</option>
          </Field>
          <ErrorMessage name="role" component="div" className="text-danger" />
        </div> 

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <Field name="password" type="password" className="form-control" />
          <ErrorMessage name="password" component="div" className="text-danger" />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Field name="confirmPassword" type="password" className="form-control" />
          <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
        </div>

        <button type="submit" className="btn btn-clair px-5 mt-3">S'inscrire</button>
      </Form>
    </Formik>
  );
};

export default AdminForm;
